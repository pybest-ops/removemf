import type { RestoreMode, WhiteBalanceMode } from './types';

export type RestoreSettingsInput = {
  restoreMode?: unknown;
  skinTonePriority?: unknown;
  whiteBalanceMode?: unknown;
  referenceObjectKey?: unknown;
};

export type RestoreModelInput = {
  method: 'mkl';
  strength: number;
  fix_white_balance: true;
  white_balance_percentile: number;
  reference_image?: string;
};

export type RestoreSettings = {
  restoreMode: RestoreMode;
  skinTonePriority: boolean;
  whiteBalanceMode: WhiteBalanceMode;
  referenceObjectKey?: string;
  modelInput: RestoreModelInput;
};

const restoreModeStrength: Record<RestoreMode, number> = {
  light: 0.25,
  natural: 0.45,
  strong: 0.7
};

const whiteBalancePercentile: Record<WhiteBalanceMode, number> = {
  soft: 90,
  standard: 95,
  strong: 98
};

// buildRestoreSettings 把用户可理解的恢复设置转换成模型入参。
export function buildRestoreSettings(input: RestoreSettingsInput = {}): RestoreSettings {
  const restoreMode = isRestoreMode(input.restoreMode) ? input.restoreMode : 'natural';
  const whiteBalanceMode = isWhiteBalanceMode(input.whiteBalanceMode) ? input.whiteBalanceMode : 'standard';
  const skinTonePriority = input.skinTonePriority === true;
  const referenceObjectKey = typeof input.referenceObjectKey === 'string' && input.referenceObjectKey ? input.referenceObjectKey : undefined;
  const baseStrength = restoreModeStrength[restoreMode];
  const strength = skinTonePriority ? Math.min(baseStrength, 0.5) : baseStrength;

  return {
    restoreMode,
    skinTonePriority,
    whiteBalanceMode,
    referenceObjectKey,
    modelInput: {
      method: 'mkl',
      strength,
      fix_white_balance: true,
      white_balance_percentile: whiteBalancePercentile[whiteBalanceMode]
    }
  };
}

// getRestoreSettingsSummary 生成结果页和状态卡使用的用户可读摘要。
export function getRestoreSettingsSummary(settings: Pick<RestoreSettings, 'restoreMode' | 'skinTonePriority' | 'whiteBalanceMode'>) {
  const restoreLabel: Record<RestoreMode, string> = {
    light: 'Light restore',
    natural: 'Natural restore',
    strong: 'Strong restore'
  };
  const whiteBalanceLabel: Record<WhiteBalanceMode, string> = {
    soft: 'Soft white balance',
    standard: 'Standard white balance',
    strong: 'Strong white balance'
  };

  return [restoreLabel[settings.restoreMode], whiteBalanceLabel[settings.whiteBalanceMode], settings.skinTonePriority ? 'Skin tone priority' : null].filter(Boolean);
}

// isReferenceObjectKeyAllowed 限制参考图只能来自受控上传目录。
export function isReferenceObjectKeyAllowed(referenceObjectKey: string) {
  return referenceObjectKey.startsWith('uploads/original/') || referenceObjectKey.startsWith('uploads/reference/');
}

// parseStoredRestoreSettings 从任务记录里的 JSON 恢复用户可读设置。
export function parseStoredRestoreSettings(value?: string | null) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as RestoreSettingsInput;
    return buildRestoreSettings(parsed);
  } catch {
    return null;
  }
}

// serializeRestoreSettings 持久化用户选择和模型映射，便于重试和排查。
export function serializeRestoreSettings(settings: RestoreSettings) {
  return JSON.stringify(settings);
}

function isRestoreMode(value: unknown): value is RestoreMode {
  return value === 'light' || value === 'natural' || value === 'strong';
}

function isWhiteBalanceMode(value: unknown): value is WhiteBalanceMode {
  return value === 'soft' || value === 'standard' || value === 'strong';
}
