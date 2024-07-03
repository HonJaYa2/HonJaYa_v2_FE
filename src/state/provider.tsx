'use client'
import store from '@/state/store';
import { Provider } from "react-redux";


const ReduxProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ReduxProvider