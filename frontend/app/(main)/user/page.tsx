import {UserPageClient} from "@/app/(main)/user/page-client";
import {Suspense} from "react";

export default function PageUser() {

    return (<Suspense fallback={<div>Loading...</div>}>
            <UserPageClient/>
        </Suspense>)
}