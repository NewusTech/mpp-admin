export interface NavProps {
  icons: string;
  title: string;
  type?: string;
  route: string;
  content?: React.ReactNode;
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
  header: string;
  style: string;
  content: React.ReactNode;
}
