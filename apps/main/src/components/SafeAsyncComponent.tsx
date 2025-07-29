import React from "react";
import ErrorBoundary from "../ErrorBoundary";

interface SafeAsyncComponentProps {
  children: React.ReactNode;
  fallback: React.ComponentType | React.ReactElement;
}

const SafeAsyncComponent: React.FC<SafeAsyncComponentProps> = ({
  children,
  fallback,
}) => {
  return (
    <ErrorBoundary>
      <React.Suspense
        fallback={
          React.isValidElement(fallback)
            ? fallback
            : React.createElement(fallback)
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default SafeAsyncComponent;
