import { useEffect, useMemo, useRef, useState } from 'react';
import AppHeader from './components/AppHeader';
import Hero from './components/Hero';
import StatBand from './components/StatBand';
import JournalSection from './components/JournalSection';
import LogDialog from './components/LogDialog';
import EntryDetailDialog from './components/EntryDetailDialog';
import DataDialog from './components/DataDialog';
import AccountDialog from './components/AccountDialog';
import ConfirmDialog from './components/ConfirmDialog';
import BackToTop from './components/BackToTop';
import Toast from './components/Toast';
import { retiredSeedIds, seedEntries } from './data/content';
import { usePersistentState } from './hooks/usePersistentState';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { useToast } from './hooks/useToast';
import { mergeEntries } from './lib/transfer';
import {
  fetchCloudEntries,
  formatAuthError,
  syncCloudEntries,
} from './lib/cloud';
import {
  computeStats,
  createId,
  filterEntries,
  sortEntries,
  todayISO,
} from './lib/format';

const IMPORT_MARKER = 'motif.historyImport.v1';
const HISTORY_PREFIX = 'history-';

function mergeImportedEntries(currentEntries) {
  const customEntries = (Array.isArray(currentEntries) ? currentEntries : []).filter(
    (entry) =>
      !String(entry?.id ?? '').startsWith(HISTORY_PREFIX) &&
      !retiredSeedIds.includes(entry?.id),
  );
  return [...customEntries, ...seedEntries];
}

function buildInitialEntries() {
  let legacyEntries = [];

  try {
    const legacy = window.localStorage.getItem('motif.entries.v2');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        legacyEntries = parsed.filter(
          (entry) => !retiredSeedIds.includes(entry.id),
        );
      }
    }
  } catch {
    // Ignore malformed legacy storage.
  }

  return [...legacyEntries, ...seedEntries];
}

export default function App() {
  const [entries, setEntries] = usePersistentState(
    'motif.entries.v3',
    buildInitialEntries,
  );
  const [activeView, setActiveView] = useState('journal');
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [dialog, setDialog] = useState(null);
  const [cloudStatus, setCloudStatus] = useState('local');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [cloudReady, setCloudReady] = useState(false);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const {
    user,
    loading: authLoading,
    configured: supabaseConfigured,
    signIn,
    signOut,
  } = useSupabaseAuth();
  const { toast, showToast, dismissToast } = useToast();

  // One-time repair for browsers that already had an empty v3 array before
  // the historical import was added. Custom records are preserved.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(IMPORT_MARKER) === '1') return;

      setEntries((current) => {
        const merged = mergeImportedEntries(current);
        window.localStorage.setItem(
          'motif.entries.v3',
          JSON.stringify(merged),
        );
        window.localStorage.setItem(IMPORT_MARKER, '1');
        return merged;
      });
    } catch {
      // Storage can be unavailable in private modes; the UI still works in memory.
    }
  }, [setEntries]);

  // On sign-in, pull the cloud copy. If the cloud is empty, upload the
  // local journal so the first login migrates the existing 151 records.
  useEffect(() => {
    if (!supabaseConfigured) {
      setCloudStatus('local');
      setCloudReady(false);
      return undefined;
    }

    if (!user) {
      setCloudStatus('local');
      setCloudReady(false);
      return undefined;
    }

    let cancelled = false;
    setCloudReady(false);
    setCloudStatus('loading');

    (async () => {
      try {
        const cloudEntries = await fetchCloudEntries();
        if (cancelled) return;

        if (cloudEntries.length > 0) {
          setEntries(cloudEntries);
          showToast(`已从云端加载 ${cloudEntries.length} 条记录。`);
        } else {
          const localEntries = entriesRef.current;
          await syncCloudEntries(user.id, localEntries);
          if (cancelled) return;
          showToast(
            localEntries.length > 0
              ? `已将 ${localEntries.length} 条本地记录上传到云端。`
              : '云端已连接。',
          );
        }

        if (cancelled) return;
        setCloudReady(true);
        setCloudStatus('synced');
        setLastSyncedAt(new Date());
      } catch (error) {
        if (cancelled) return;
        setCloudReady(false);
        setCloudStatus('error');
        showToast(`云端连接失败：${formatAuthError(error)}`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, supabaseConfigured, setEntries, showToast]);

  // Push local changes to Supabase with a short debounce.
  useEffect(() => {
    if (!supabaseConfigured || !user || !cloudReady) return undefined;

    setCloudStatus('syncing');
    const timer = window.setTimeout(async () => {
      try {
        await syncCloudEntries(user.id, entries);
        setCloudStatus('synced');
        setLastSyncedAt(new Date());
      } catch {
        setCloudStatus('error');
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [entries, user?.id, cloudReady, supabaseConfigured]);

  const stats = useMemo(() => computeStats(entries), [entries]);

  const visibleEntries = useMemo(() => {
    const filtered = filterEntries(entries, activeFilter, query, activeView);
    return sortEntries(filtered, sortBy);
  }, [entries, activeFilter, query, activeView, sortBy]);

  const featured = useMemo(() => {
    const watched = entries.filter((entry) => entry.status === 'watched');
    return sortEntries(watched, 'recent')[0] ?? entries[0] ?? null;
  }, [entries]);

  const activeEntry =
    dialog?.type === 'detail'
      ? entries.find((entry) => entry.id === dialog.id) ?? null
      : null;

  const heading =
    activeView === 'watchlist' || activeFilter === 'watchlist'
      ? '等待入场'
      : activeFilter === 'favorites'
        ? '私藏片单'
        : activeFilter === 'watched'
          ? '看过之后'
          : '最近记下';

  const scrollToJournal = () => {
    window.requestAnimationFrame(() => {
      document.getElementById('journal')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleNavigate = (id) => {
    if (id === 'stats') {
      document.getElementById('stats')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    if (id === 'watchlist') {
      setActiveView('watchlist');
      setActiveFilter('watchlist');
      scrollToJournal();
      return;
    }

    setActiveView('journal');
    setActiveFilter('all');
    scrollToJournal();
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setActiveView(filterId === 'watchlist' ? 'watchlist' : 'journal');
  };

  const handleResetFilters = () => {
    setQuery('');
    setActiveFilter('all');
    setActiveView('journal');
  };

  const handleOpen = (entry) => {
    setDialog({ type: 'detail', id: entry.id });
  };

  const handleOpenLog = () => {
    if (!user) {
      showToast('未登录状态无法记录电影，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }
    setDialog({ type: 'log', entry: null });
  };

  const handleOpenData = () => {
    if (!user) {
      showToast('未登录状态无法导入或导出数据，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }
    setDialog({ type: 'data' });
  };

  const handleOpenAccount = () => {
    setDialog({ type: 'account' });
  };

  const handleCloudSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      showToast(`退出登录失败：${formatAuthError(error)}`);
      return;
    }
    setDialog(null);
    showToast('已退出云端账号，本地缓存仍保留。');
  };

  const handleSyncNow = async () => {
    if (!user) {
      setDialog({ type: 'account' });
      return;
    }

    setCloudStatus('syncing');
    try {
      await syncCloudEntries(user.id, entriesRef.current);
      setCloudStatus('synced');
      setLastSyncedAt(new Date());
      showToast('已同步到云端。');
    } catch (error) {
      setCloudStatus('error');
      showToast(`云端同步失败：${formatAuthError(error)}`);
    }
  };

  const handleImportData = (importedEntries, mode) => {
    if (!user) {
      showToast('未登录状态无法导入记录，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }

    const executeImport = () => {
      const result = mergeEntries(entries, importedEntries, mode);
      setEntries(result.entries);
      setDialog(null);

      if (mode === 'replace') {
        showToast(`已替换为 ${importedEntries.length} 条记录。`);
      } else {
        showToast(
          `导入完成：新增 ${result.added} 条，更新 ${result.updated} 条。`,
        );
      }
    };

    if (mode === 'replace') {
      setDialog({
        type: 'confirm',
        title: '确认覆盖手记记录',
        description: `确定用导入文件中的 ${importedEntries.length} 条记录覆盖当前的 ${entries.length} 条记录吗？此操作不可撤销。`,
        confirmLabel: '确认覆盖',
        cancelLabel: '取消',
        danger: true,
        onConfirm: executeImport,
        onClose: () => setDialog({ type: 'data' }),
      });
      return;
    }

    executeImport();
  };

  const handleEdit = (entry) => {
    if (!user) {
      showToast('未登录状态无法编辑电影记录，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }
    setDialog({ type: 'log', entry, returnToDetailId: null });
  };

  const handleEditFromDetail = (entry) => {
    if (!user) {
      showToast('未登录状态无法编辑电影记录，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }
    setDialog({ type: 'log', entry, returnToDetailId: entry.id });
  };

  const handleCloseLog = () => {
    if (dialog?.type === 'log' && dialog.returnToDetailId) {
      setDialog({ type: 'detail', id: dialog.returnToDetailId });
      return;
    }
    setDialog(null);
  };

  const handleSave = (values) => {
    if (!user) {
      showToast('未登录状态无法保存电影记录，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }

    if (values.id) {
      setEntries((current) =>
        current.map((entry) =>
          entry.id === values.id ? { ...entry, ...values } : entry,
        ),
      );
      showToast('记录已更新。');
      setDialog({ type: 'detail', id: values.id });
      return;
    }

    const newEntry = {
      ...values,
      id: createId(),
      addedAt: new Date().toISOString(),
    };

    setEntries((current) => [newEntry, ...current]);
    showToast('已加入你的观影手记。');
    setDialog({ type: 'detail', id: newEntry.id });
  };

  const handleToggleFavorite = (entry) => {
    if (!user) {
      showToast('未登录状态无法更改收藏，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }

    const nextFavorite = !entry.favorite;
    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id ? { ...item, favorite: nextFavorite } : item,
      ),
    );
    showToast(
      nextFavorite
        ? `已将《${entry.title}》加入收藏。`
        : `已取消收藏《${entry.title}》。`,
    );
  };

  const handleToggleStatus = (entry) => {
    if (!user) {
      showToast('未登录状态无法更改观影状态，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }

    const movingToWatchlist = entry.status === 'watched';
    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id
          ? {
              ...item,
              status: movingToWatchlist ? 'watchlist' : 'watched',
              watchedAt: movingToWatchlist ? '' : todayISO(),
              watchedYear: movingToWatchlist
                ? ''
                : new Date().getFullYear(),
              addedAt: movingToWatchlist
                ? item.addedAt || new Date().toISOString()
                : item.addedAt,
            }
          : item,
      ),
    );
    showToast(
      movingToWatchlist
        ? `《${entry.title}》已移入待看。`
        : `已将《${entry.title}》标记为已看。`,
    );
  };

  const handleUpdate = (entry, patch) => {
    if (!user) {
      showToast('未登录状态无法修改评分，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }

    setEntries((current) =>
      current.map((item) =>
        item.id === entry.id ? { ...item, ...patch } : item,
      ),
    );
    if (Object.prototype.hasOwnProperty.call(patch, 'rating')) {
      showToast(
        Number(patch.rating) > 0
          ? `评分已更新为 ${Number(patch.rating).toFixed(1)}。`
          : '评分已清除。',
      );
    }
  };

  const handleDelete = (entry) => {
    if (!user) {
      showToast('未登录状态无法删除电影，请先登录账号。');
      setDialog({ type: 'account' });
      return;
    }

    const returnToDetailId =
      dialog?.type === 'detail' && dialog.id === entry.id ? entry.id : null;

    setDialog({
      type: 'confirm',
      title: '删除观影记录',
      entry,
      description:
        '此操作不可撤销。该电影记录及相关的个人短评、评分等数据将被永久删除。',
      confirmLabel: '删除记录',
      cancelLabel: '取消',
      danger: true,
      onConfirm: () => {
        setEntries((current) => current.filter((item) => item.id !== entry.id));
        setDialog(null);
        showToast(`已从手记中删除《${entry.title}》。`);
      },
      onClose: () => {
        if (returnToDetailId) {
          setDialog({ type: 'detail', id: returnToDetailId });
        } else {
          setDialog(null);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div
        className="min-h-screen"
        inert={dialog ? true : undefined}
        aria-hidden={dialog ? 'true' : undefined}
      >
        <AppHeader
          activeView={activeView}
          onNavigate={handleNavigate}
          onLogFilm={handleOpenLog}
          onOpenData={handleOpenData}
          onOpenAccount={handleOpenAccount}
          user={user}
          cloudStatus={cloudStatus}
        />

        <main>
          <Hero
            featured={featured}
            watchlistCount={stats.watchlist}
            onOpenFeatured={handleOpen}
            onLogFilm={handleOpenLog}
            onBrowseWatchlist={() => handleNavigate('watchlist')}
            onOpenAccount={handleOpenAccount}
            user={user}
            cloudStatus={cloudStatus}
          />

          <StatBand stats={stats} />

          <JournalSection
            heading={heading}
            entries={visibleEntries}
            totalCount={entries.length}
            query={query}
            onQueryChange={setQuery}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeView={activeView}
            onOpen={handleOpen}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onLogFilm={handleOpenLog}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {dialog?.type === 'confirm' && (
        <ConfirmDialog
          title={dialog.title}
          description={dialog.description}
          confirmLabel={dialog.confirmLabel}
          cancelLabel={dialog.cancelLabel}
          danger={dialog.danger}
          entry={dialog.entry}
          onConfirm={dialog.onConfirm}
          onClose={dialog.onClose}
        />
      )}

      {dialog?.type === 'log' && (
        <LogDialog
          entry={dialog.entry}
          onClose={handleCloseLog}
          onSave={handleSave}
        />
      )}

      {dialog?.type === 'data' && (
        <DataDialog
          entries={entries}
          user={user}
          onClose={() => setDialog(null)}
          onImport={handleImportData}
          onRequireAuth={() => {
            showToast('未登录状态无法导入或导出数据，请先登录账号。');
            setDialog({ type: 'account' });
          }}
        />
      )}

      {dialog?.type === 'account' && (
        <AccountDialog
          user={user}
          authLoading={authLoading}
          configured={supabaseConfigured}
          cloudStatus={cloudStatus}
          lastSyncedAt={lastSyncedAt}
          entryCount={entries.length}
          onClose={() => setDialog(null)}
          onSignIn={signIn}
          onSignOut={handleCloudSignOut}
          onSyncNow={handleSyncNow}
        />
      )}

      {activeEntry && (
        <EntryDetailDialog
          entry={activeEntry}
          onClose={() => setDialog(null)}
          onEdit={handleEditFromDetail}
          onUpdate={handleUpdate}
          onToggleFavorite={handleToggleFavorite}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      <BackToTop />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
