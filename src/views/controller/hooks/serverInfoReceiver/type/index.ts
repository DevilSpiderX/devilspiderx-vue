export type ErrorHandler = (reason?: any) => void;

export interface ServerInfoReceiver {
    errorHandler: ErrorHandler | null;
    setCD(cd: number): void;
    close(): void;
    isOpen(): boolean;
}