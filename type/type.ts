export interface NavProps {
  icons: string;
  title: string;
  type?: string;
  route: string;
}

export interface CardDashboardQueueProps {
  title: string;
  number: number;
  background: string;
}

export interface CardStepProps {
  title: string;
  isLastStep: boolean;
  isActive: boolean;
}

export interface AlertDialogPopupProps {
  title: string;
  content: React.ReactNode;
}
