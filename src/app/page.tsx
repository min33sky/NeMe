import AuthForm from '@/components/auth/AuthForm';
import Image from 'next/image';

export default function Home() {
  // TODO: 로그인 여부에 따라서 로그인 페이지 또는 메인 페이지로 이동

  return (
    <main className="flex flex-col justify-center min-h-full bg-slate-100 py-12 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src={`/images/logo.png`}
          alt={'Logo'}
          width={48}
          height={48}
          className={`mx-auto w-auto`}
        />
        <h2 className="mt-6 text-center text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
          서비스를 이용하려면 인증이 필요해요.
        </h2>
      </div>

      <AuthForm />
    </main>
  );
}
