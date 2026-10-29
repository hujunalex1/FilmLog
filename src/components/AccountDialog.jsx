import { useState } from 'react';
import ModalShell from './ModalShell';
import { CheckIcon, CloudCheckIcon, CloudIcon } from './Icons';
import { formatAuthError } from '../lib/cloud';

const statusCopy = {
  local: { label: '未登录', detail: '当前只保存在本机' },
  loading: { label: '连接中', detail: '正在读取云端记录' },
  syncing: { label: '同步中', detail: '正在把改动写入云端' },
  synced: { label: '已同步', detail: '本地与云端一致' },
  error: { label: '同步失败', detail: '请检查网络后重试' },
};

const dotClass = {
  local: 'bg-low',
  loading: 'bg-accent',
  syncing: 'bg-accent',
  synced: 'bg-[#7f9b72]',
  error: 'bg-[#d58b7e]',
};

function formatSyncTime(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

export default function AccountDialog({
  user,
  authLoading,
  configured,
  cloudStatus,
  lastSyncedAt,
  entryCount,
  onClose,
  onSignIn,
  onSignOut,
  onSyncNow,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);

  const signedIn = Boolean(user);
  const status = statusCopy[cloudStatus] ?? statusCopy.local;
  const syncing = cloudStatus === 'loading' || cloudStatus === 'syncing';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!email.trim() || !password) {
      setError('请输入邮箱和密码。');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await onSignIn(email, password);
      if (result?.error) {
        setError(formatAuthError(result.error));
      } else {
        setPassword('');
      }
    } catch (caught) {
      setError(formatAuthError(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ModalShell title="云同步" onClose={onClose} size="sm">
      <div className="p-6 sm:p-8">
        {!configured ? (
          <div className="border border-[#d58b7e]/35 bg-[#d58b7e]/10 p-4 text-[12.5px] leading-[1.7] text-[#e3aa9f]">
            Supabase 环境变量尚未配置。本地开发请在 <code>.env.local</code> 中填写，线上部署请在托管平台（如 Cloudflare Pages）的环境变量中添加 <code>VITE_SUPABASE_URL</code> 和 <code>VITE_SUPABASE_ANON_KEY</code>。
          </div>
        ) : signedIn ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-[linear-gradient(160deg,#3b3c42,#232429)] text-[13px] font-semibold text-mid">
                {(user.email?.[0] ?? '我').toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-[.12em] text-low">
                  已登录
                </p>
                <p className="mt-1 truncate text-[14px] font-medium text-hi">
                  {user.email ?? 'Supabase 用户'}
                </p>
              </div>
            </div>

            <div className="mt-6 border border-hairline bg-elevated/35 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline bg-panel text-accent">
                    <CloudCheckIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-[13px] font-semibold text-hi">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${dotClass[cloudStatus] ?? dotClass.local}`}
                      />
                      {status.label}
                    </p>
                    <p className="mt-1 text-[11px] text-low">
                      {cloudStatus === 'synced' && lastSyncedAt
                        ? `本地与云端一致 · ${formatSyncTime(lastSyncedAt)}`
                        : status.detail}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onSyncNow}
                  disabled={syncing}
                  className="focus-ring inline-flex shrink-0 items-center gap-1.5 border border-hairline px-2.5 py-1.5 text-[9.5px] font-semibold tracking-[.08em] text-mid transition-colors duration-200 hover:border-hi/20 hover:text-hi disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {syncing ? '同步中…' : '立即同步'}
                </button>
              </div>
            </div>

            <p className="mt-4 text-[11px] leading-[1.7] text-low">
              云端数据只有当前账号可见。退出后，这台设备仍保留本地缓存；下次登录时会以云端数据为准。
            </p>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-hairline pt-5">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="focus-ring border border-hairline px-4 py-2.5 text-[10px] font-semibold tracking-[.08em] text-mid transition-colors duration-200 hover:border-hi/20 hover:text-hi disabled:cursor-not-allowed disabled:opacity-40"
              >
                {signingOut ? '正在退出…' : '退出登录'}
              </button>
              <span className="flex items-center gap-1.5 text-[9px] tracking-[.08em] text-low">
                <CloudCheckIcon className="h-3.5 w-3.5" />
                Supabase
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-elevated text-accent">
                <CloudIcon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-[19px] font-semibold tracking-[-0.012em] text-hi">
                  登录后跨设备同步
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.7] text-mid">
                  登录 Supabase 账号后，如果云端为空，会自动上传当前 {entryCount}{' '}
                  条记录；如果云端已有数据，则以云端为准。之后每次改动都会自动同步。
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6" noValidate>
              <div>
                <label
                  htmlFor="account-email"
                  className="text-[10px] font-bold tracking-[.14em] text-low"
                >
                  邮箱
                </label>
                <input
                  id="account-email"
                  data-autofocus
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="focus-ring mt-2 h-11 w-full border border-hairline bg-elevated px-3.5 text-[13px] text-hi placeholder:text-low/55 transition-colors duration-200 focus:border-accent"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="account-password"
                  className="text-[10px] font-bold tracking-[.14em] text-low"
                >
                  密码
                </label>
                <input
                  id="account-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  placeholder="输入 Supabase 用户密码"
                  className="focus-ring mt-2 h-11 w-full border border-hairline bg-elevated px-3.5 text-[13px] text-hi placeholder:text-low/55 transition-colors duration-200 focus:border-accent"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="mt-4 border border-[#d58b7e]/35 bg-[#d58b7e]/10 px-3.5 py-3 text-[12px] leading-[1.6] text-[#e3aa9f]"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 bg-accent px-4 py-3 text-[10.5px] font-bold tracking-[.1em] text-accent-ink transition-[background-color,transform] duration-200 hover:bg-[#c18f50] active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? '正在登录…' : '登录并同步'}
                {!submitting && <CheckIcon className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-5 border-t border-hairline pt-4">
              <p className="text-[10px] leading-[1.7] text-low">
                还没有账号？在 Supabase 控制台进入 Authentication → Users，
                用邮箱和密码添加一个用户，并开启 Auto Confirm。然后用这个账号登录。
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[9px] tracking-[.08em] text-low">
                <CloudCheckIcon className="h-3.5 w-3.5" />
                数据通过 Supabase RLS 隔离，只有登录用户可见
              </p>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
