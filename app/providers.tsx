"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { WarehouseProvider } from "@/context/WarehouseContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <WarehouseProvider>{children}</WarehouseProvider>
    </Provider>
  );
}
