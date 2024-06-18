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

export interface OptionType {
  id: number;
  key: string;
}

export interface CardType {
  id?: any;
  toggle?: boolean;
  field: string;
  tipedata: "text" | "number" | "radio" | "checkbox" | "date";
  isrequired: string;
  options?: OptionType[];
}

export interface CardTypeFile {
  id?: any;
  toggle?: boolean;
  field: string;
  tipedata: "file";
  isrequired?: string;
}
