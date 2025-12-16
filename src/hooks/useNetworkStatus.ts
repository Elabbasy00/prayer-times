// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkStatus {
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
    type: string | null;
    details: NetInfoState['details'] | null;
}

/**
 * Hook to monitor network connectivity status
 * @returns Current network status
 */
export const useNetworkStatus = (): NetworkStatus => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        isConnected: null,
        isInternetReachable: null,
        type: null,
        details: null,
    });

    useEffect(() => {
        // Get initial network state
        NetInfo.fetch().then((state: NetInfoState) => {
            setNetworkStatus({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
                details: state.details,
            });
        });

        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setNetworkStatus({
                isConnected: state.isConnected,
                isInternetReachable: state.isInternetReachable,
                type: state.type,
                details: state.details,
            });
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return networkStatus;
};

export default useNetworkStatus;
