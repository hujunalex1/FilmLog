import { useRef, useState } from 'react';
import ModalShell from './ModalShell';
import {
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  UploadIcon,
} from './Icons';
import {
  importFileSizeLimit,
  parseImportPayload,
  saveBackupFile,
} from '../lib/transfer';

const modeOptions = [
  {
    id: 'merge',
    title: '合并',
    description: '保留现有记录，同 ID 覆盖',
  },
  {
    id: 'replace',
    title: '替换',
    description: '覆盖当前全部记录',
  },
];

export default function DataDialog({ entries, onClose, onImport }) {
  const inputRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const [mode, setMode] = useState('merge');
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [importError, setImportError] = useState('');
  const [exportError, setExportError] = useState('');
  const [exportState, setExportState] = useState('idle');

  const handleExport = async () => {
    if (!entries.length || busy) return;
    setBusy(true);
    setExportError('');
    setExportState('working');
    try {
      const result = await saveBackupFile(entries);
      if (result.canceled) {
        setExportState('idle');
      } else {
        setExportState(result.method === 'picker' ? 'saved' : 'downloaded');
      }
    } catch {
      setExportState('idle');
      setExportError('导出失败，请稍后再试。');
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    if (file.size > importFileSizeLimit) {
      setFileData(null);
      setImportError('文件超过 5 MB，请拆分后再导入。');
      return;
    }

    setBusy(true);
    setImportError('');

    try {
      const text = await file.text();
      const parsed = parseImportPayload(text);
      if (parsed.error) {
        setFileData(null);
        setImportError(parsed.error);
      } else {
        setFileData({
          name: file.name,
          entries: parsed.entries,
          skipped: parsed.skipped,
        });
        setMode('merge');
      }
    } catch {
      setFileData(null);
      setImportError('读取文件失败，请重新选择。');
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    if (!fileData?.entries?.length) return;
    onImport(fileData.entries, mode);
  };

  const clearFile = () => {
    setFileData(null);
    setImportError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const exportMessage =
    exportState === 'saved'
      ? '已保存到你选择的位置。'
      : exportState === 'downloaded'
        ? '已开始下载，可把文件移动到 iCloud Drive。'
        : '';

  return (
    <ModalShell title="导入 / 导出" onClose={onClose} size="md">
      <div className="p-6 sm:p-8">
        <p className="max-w-[56ch] text-[13.5px] leading-[1.7] text-mid">
          把整本观影手记导出为 JSON 备份，或从其他设备、iCloud Drive
          导入一份备份。文件只在本机浏览器中处理。
        </p>

        <section className="mt-7">
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-accent" aria-hidden="true" />
            <p className="text-[10px] font-bold tracking-[.14em] text-low">
              备份
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-5 border border-hairline bg-elevated/35 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-[19px] font-semibold tracking-[-0.012em] text-hi">
                导出当前记录
              </h3>
              <p className="mt-1.5 max-w-[44ch] text-[12.5px] leading-[1.65] text-mid">
                包含片名、评分、短评、观看年份等全部字段，共{' '}
                {entries.length} 条。支持时可在保存对话框里直接选择 iCloud Drive；不支持时会下载到默认目录。
              </p>
              {exportMessage && (
                <p
                  className="mt-2 flex items-center gap-1.5 text-[10.5px] font-medium text-accent"
                  role="status"
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                  {exportMessage}
                </p>
              )}
              {exportError && (
                <p className="mt-2 text-[11px] text-[#d58b7e]" role="alert">
                  {exportError}
                </p>
              )}
            </div>

            <button
              type="button"
              data-autofocus
              onClick={handleExport}
              disabled={!entries.length || busy}
              className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 bg-accent px-4 py-3 text-[10.5px] font-bold tracking-[.08em] text-accent-ink transition-[background-color,transform] duration-250 hover:bg-[#c18f50] active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <DownloadIcon className="h-4 w-4" />
              {busy && exportState === 'working' ? '正在导出…' : '导出 JSON'}
            </button>
          </div>
        </section>

        <div className="my-8 h-px bg-hairline" />

        <section>
          <div className="flex items-center gap-2">
            <span className="h-px w-5 bg-accent" aria-hidden="true" />
            <p className="text-[10px] font-bold tracking-[.14em] text-low">
              恢复
            </p>
          </div>
          <h3 className="mt-3 text-[19px] font-semibold tracking-[-0.012em] text-hi">
            导入 JSON
          </h3>
          <p className="mt-1.5 max-w-[54ch] text-[12.5px] leading-[1.65] text-mid">
            支持 Motif 导出的备份，或直接把记录数组作为 JSON 文件导入。
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
              event.target.value = '';
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`focus-ring mt-4 flex w-full flex-col items-center justify-center border border-dashed px-5 py-8 text-center transition-colors duration-200 ${
              dragOver
                ? 'border-accent bg-accent/5'
                : 'border-hairline bg-elevated/25 hover:border-hi/25 hover:bg-elevated/45'
            }`}
            aria-label="选择或拖入 JSON 文件"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-panel text-accent">
              <UploadIcon className="h-4 w-4" />
            </span>
            <span className="mt-3 text-[13px] font-medium text-hi">
              拖入 JSON 文件，或点击选择
            </span>
            <span className="mt-1 text-[10px] tracking-[.03em] text-low">
              最大 5 MB · 可从 iCloud Drive 选择
            </span>
          </button>

          {importError && (
            <div
              className="mt-4 border border-[#d58b7e]/35 bg-[#d58b7e]/10 px-3.5 py-3 text-[12px] text-[#e3aa9f]"
              role="alert"
            >
              {importError}
            </div>
          )}

          {fileData && (
            <div className="mt-4 border border-hairline bg-panel">
              <div className="flex items-start justify-between gap-3 border-b border-hairline p-4">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-hi">
                    {fileData.name}
                  </p>
                  <p className="mt-1 text-[10.5px] text-low">
                    {fileData.entries.length} 条可导入
                    {fileData.skipped > 0
                      ? ` · 已跳过 ${fileData.skipped} 条无效记录`
                      : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="focus-ring -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-low transition-colors hover:bg-white/5 hover:text-hi"
                  aria-label="移除选择的文件"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  {fileData.entries.slice(0, 4).map((entry) => (
                    <span
                      key={entry.id}
                      className="max-w-[210px] truncate border border-hairline px-2 py-1 text-[10px] text-mid"
                    >
                      {entry.title}
                    </span>
                  ))}
                  {fileData.entries.length > 4 && (
                    <span className="px-2 py-1 text-[10px] text-low">
                      +{fileData.entries.length - 4} 条
                    </span>
                  )}
                </div>

                <div
                  className="mt-4 grid gap-2 sm:grid-cols-2"
                  role="group"
                  aria-label="导入方式"
                >
                  {modeOptions.map((option) => {
                    const active = mode === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setMode(option.id)}
                        className={`focus-ring border p-3 text-left transition-colors duration-200 ${
                          active
                            ? 'border-accent bg-accent/10'
                            : 'border-hairline bg-elevated/35 hover:border-hi/20'
                        }`}
                      >
                        <span
                          className={`block text-[11px] font-semibold tracking-[.08em] ${
                            active ? 'text-accent' : 'text-hi'
                          }`}
                        >
                          {option.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-low">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {mode === 'replace' && (
                  <p className="mt-2 text-[10px] leading-[1.6] text-[#d58b7e]/80">
                    替换前会再次确认；当前记录将被文件内容完全覆盖。
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleImport}
                  className="focus-ring mt-3 inline-flex w-full items-center justify-center gap-2 bg-accent px-4 py-3 text-[10.5px] font-bold tracking-[.08em] text-accent-ink transition-[background-color,transform] duration-200 hover:bg-[#c18f50] active:scale-[.985]"
                >
                  {mode === 'merge'
                    ? `合并导入 ${fileData.entries.length} 条记录`
                    : `替换为 ${fileData.entries.length} 条记录`}
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-[10px] leading-[1.7] text-low">
            把导出的 JSON 放进 iCloud Drive 就会自动同步；在另一台设备打开本站后，
            选择该文件导入即可。导入不会上传到服务器。
          </p>
        </section>
      </div>
    </ModalShell>
  );
}
