export default class LoginRequiredException extends Error {
  constructor(message: string = '로그인이 필요합니다.') {
    super(message);
    this.name = 'LoginRequiredException';
  }
}
