import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        // <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
        //     <div>
        //         <Link href="/">
        //             <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
        //         </Link>
        //     </div>

        //     <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
        //         {children}
        //     </div>
        // </div>
        <div className="d-flex flex-column min-vh-100 align-items-center bg-light pt-3 justify-content-center">
            <div>
                <Link href="/">
                    <ApplicationLogo className="" style={{ height: '80px', width: '80px', color: '#6c757d' }} />
                </Link>
            </div>

            <div className="mt-3 w-100 bg-white p-4 shadow-sm rounded" style={{ maxWidth: '400px' }}>
                {children}
            </div>
        </div>
    );
}
