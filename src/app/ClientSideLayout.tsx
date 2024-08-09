
'use client'

import { useSelector } from "react-redux"
// import MatchingModal from "./_components/wait/MatchingModal"
import { RootState } from "@/state/reducers/rootReducer"
import { CookiesProvider } from "react-cookie"


type Props = {}

const ClientSideLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const isOpened = useSelector((state: RootState) => state.matchingStatusModal.isOpened)

    return (
        <CookiesProvider>
            <div>
                {children}
                {/* {isOpened && <MatchingModal />} */}
            </div>
        </CookiesProvider>

    )
}

export default ClientSideLayout