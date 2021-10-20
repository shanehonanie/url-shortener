const MAX_SHORT_URL_LENGTH = 10;

export const validateURL = (urlToValidate: string): boolean => {
  if (urlToValidate === null || typeof urlToValidate !== 'string') return false;

  let url;

  // cast to URL, will throw error if not a valid url
  try {
    url = new URL(urlToValidate);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateUserName = (userName: string): boolean => {
  if (userName === null || typeof userName !== 'string') {
    return false;
  }
  return true;
};

export const validateIsRandomGenerated = (isRandomGenerated: boolean): boolean => {
  if (isRandomGenerated === null || typeof isRandomGenerated !== 'boolean') {
    return false;
  }
  return true;
};

export const validateShortURL = (userDefinedShortURL: string): boolean => {
  if (
    userDefinedShortURL === null ||
    typeof userDefinedShortURL !== 'string' ||
    userDefinedShortURL.length > MAX_SHORT_URL_LENGTH
  ) {
    return false;
  }
  return true;
};
