const ALLOWED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateShortLink = () => {
  let randomShortLink = '';
  for (let i = 0; i < 10; i++) {
    randomShortLink += ALLOWED_CHARACTERS.charAt(Math.floor(Math.random() * ALLOWED_CHARACTERS.length));
  }

  return randomShortLink;
};
