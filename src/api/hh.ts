export const HH_API_URL = 'https://api.hh.ru';
export const HH_TOKEN_STORAGE_KEY = 'hhAccessToken';

const HH_USER_AGENT = 'parseHH/1.0 (md-front@users.noreply.github.com)';

export interface HhErrorPayload {
  errors?: Array<{
    type?: string;
    value?: string;
    description?: string;
  }>;
  description?: string;
  request_id?: string;
}

export class HhApiError extends Error {
  status: number;

  type?: string;

  value?: string;

  requestId?: string;

  constructor(status: number, payload?: HhErrorPayload) {
    const apiError = payload?.errors?.[0];

    super(apiError?.description || payload?.description || `hh.ru API error ${status}`);

    this.name = 'HhApiError';
    this.status = status;
    this.type = apiError?.type;
    this.value = apiError?.value;
    this.requestId = payload?.request_id;

    // Нужно для корректной работы instanceof при компиляции в ES5.
    Object.setPrototypeOf(this, HhApiError.prototype);
  }
}

export const getHhToken = (): string => {
  try {
    return localStorage.getItem(HH_TOKEN_STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
};

export const setHhToken = (token: string) => {
  localStorage.setItem(HH_TOKEN_STORAGE_KEY, token.trim());
};

export const removeHhToken = () => {
  localStorage.removeItem(HH_TOKEN_STORAGE_KEY);
};

export const hasHhToken = (): boolean => Boolean(getHhToken());

export const hhFetch = (
  // eslint-disable-next-line no-undef
  url: string,
  // eslint-disable-next-line no-undef
  init: RequestInit = {},
  token: string = getHhToken(),
): Promise<Response> => {
  const headers = new Headers(init.headers);

  headers.set('HH-User-Agent', HH_USER_AGENT);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, { ...init, headers });
};

export const parseHhError = async (response: Response): Promise<HhApiError> => {
  let payload: HhErrorPayload | undefined;

  try {
    payload = await response.json();
  } catch (e) {
    payload = undefined;
  }

  return new HhApiError(response.status, payload);
};

export const isAuthHhError = (error: unknown): boolean => error instanceof HhApiError
  && (error.status === 401 || error.status === 403);

export const getHhErrorMessage = (error: unknown): string => {
  if (!(error instanceof HhApiError)) {
    return 'Не удалось загрузить вакансии с hh.ru. Проверьте подключение к интернету и повторите попытку.';
  }

  if (error.type === 'oauth') {
    if (error.value === 'token_expired') {
      return 'Срок действия токена hh.ru истёк. Получите новый токен и укажите его снова.';
    }

    if (error.value === 'application_not_found') {
      return 'Приложение, которому принадлежит токен, было удалено. Получите новый токен приложения.';
    }

    if (error.value === 'user_auth_expected') {
      return 'Для этого запроса нужен токен пользователя hh.ru, токен приложения не подходит.';
    }

    return 'hh.ru отклонил токен. Проверьте, что он скопирован полностью и не был отозван.';
  }

  if (error.status === 403) {
    return 'hh.ru запретил запрос (403). Проверьте токен и права приложения.';
  }

  return `Ошибка hh.ru API (${error.status}). Попробуйте повторить запрос позже.`;
};

export type HhTokenCheckResult = 'valid' | 'invalid' | 'unknown';

export const checkHhToken = async (token: string): Promise<HhTokenCheckResult> => {
  try {
    const response = await hhFetch(`${HH_API_URL}/me`, {}, token);

    if (response.ok) {
      return 'valid';
    }

    if (response.status === 401 || response.status === 403) {
      return 'invalid';
    }

    return 'unknown';
  } catch (e) {
    return 'unknown';
  }
};
