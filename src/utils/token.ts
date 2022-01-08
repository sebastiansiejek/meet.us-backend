import dayjs from 'dayjs';

export const getTokenExpiresTime = () => dayjs().add(48, 'h').unix();
