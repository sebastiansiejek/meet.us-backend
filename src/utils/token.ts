import dayjs from 'dayjs';

export const getTokenExpiresTime = () => dayjs().add(2, 'd').unix();
export const getRefreshTokenExpiresTime = () =>
  dayjs.unix(getTokenExpiresTime()).add(1, 'd').unix();
