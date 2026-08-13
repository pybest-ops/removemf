import type { RestoreMode, WhiteBalanceMode } from './types';

export type RestoreSettingsInput = {
  restoreMode?: unknown;
  skinTonePriority?: unknown;
  whiteBalanceMode?: unknown;
  referenceObjectKey?: unknown;
};

export type RestoreModelInput = {
  prompt: string;
  aspect_ratio: 'match_input_image';
  output_format: 'png';
  safety_tolerance: 2;
  prompt_upsampling: boolean;
  reference_image?: string;
};

export type RestoreSettings = {
  restoreMode: RestoreMode;
  skinTonePriority: boolean;
  whiteBalanceMode: WhiteBalanceMode;
  referenceObjectKey?: string;
  modelInput: RestoreModelInput;
};

const restoreModePrompt: Record<RestoreMode, string> = {
  light: 'Apply a conservative restoration. Reduce the green and yellow matcha color cast while keeping the original photographic detail and lighting close to the input.',
  natural: 'Restore the image into a natural realistic photograph. Remove the matcha-style green/yellow color cast, reduce the artificial filter look, recover neutral whites, realistic material colors, and natural skin tones.',
  strong: 'Aggressively convert the matcha-tinted stylized image into a realistic natural photograph. Remove the green/yellow cast and painterly filtered texture, restore believable real-world lighting, true whites, natural skin tones, and photographic detail.'
};

const whiteBalancePrompt: Record<WhiteBalanceMode, string> = {
  soft: 'Use a gentle white balance correction and avoid overcorrecting warm ambient light.',
  standard: 'Use standard neutral white balance so whites and grays no longer appear green or yellow.',
  strong: 'Use strong neutral white balance correction, especially in highlights, walls, windows, clothing, skin, and white objects.'
};

// buildRestoreSettings 把用户可理解的恢复设置转换成模型入参。
export function buildRestoreSettings(input: RestoreSettingsInput = {}): RestoreSettings {
  const restoreMode = isRestoreMode(input.restoreMode) ? input.restoreMode : 'natural';
  const whiteBalanceMode = isWhiteBalanceMode(input.whiteBalanceMode) ? input.whiteBalanceMode : 'standard';
  const skinTonePriority = input.skinTonePriority === true;
  const referenceObjectKey = typeof input.referenceObjectKey === 'string' && input.referenceObjectKey ? input.referenceObjectKey : undefined;
  const prompt = buildRestorePrompt({ restoreMode, skinTonePriority, whiteBalanceMode });

  return {
    restoreMode,
    skinTonePriority,
    whiteBalanceMode,
    referenceObjectKey,
    modelInput: {
      prompt,
      aspect_ratio: 'match_input_image',
      output_format: 'png',
      safety_tolerance: 2,
      prompt_upsampling: true
    }
  };
}

// buildRestorePrompt 生成图像编辑模型使用的还原指令。
function buildRestorePrompt(settings: Pick<RestoreSettings, 'restoreMode' | 'skinTonePriority' | 'whiteBalanceMode'>) {
  return [
    restoreModePrompt[settings.restoreMode],
    whiteBalancePrompt[settings.whiteBalanceMode],
    settings.skinTonePriority ? 'Prioritize realistic human skin tones and do not leave skin green, yellow, gray, or waxy.' : null,
    'Preserve the same scene layout, camera angle, subject placement, pose, objects, framing, and perspective.',
    'Do not add new objects, remove important objects, change the person identity, change the composition, add text, or turn the image into a painting, anime, illustration, CGI, or fantasy scene.',
    'The result should look like a plausible unfiltered real photo of the same scene.'
  ].filter(Boolean).join(' ');
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
