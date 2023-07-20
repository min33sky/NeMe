'use client';

import useActiveChannel from '../hooks/useActiveChannel';

/**
 * 실시간 접속자를 가져오는 컴포넌트
 */
const ActiveStatus = () => {
  useActiveChannel();

  return null;
};

export default ActiveStatus;
