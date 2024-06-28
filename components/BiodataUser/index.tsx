import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UserInfoProps {
  userInfo: {
    nik?: string;
    name?: string;
    telepon?: string;
    email?: string;
    alamat?: string;
    kecamatan?: string;
    desa?: string;
    pekerjaan?: string;
    tempat_lahir?: string;
    tgl_lahir?: string;
    rt?: string;
    rw?: string;
    fileijazahlain: string;
    fileijazahsd: string;
    fileijazahsma: string;
    fileijazahsmp: string;
    filekk: string;
    filektp: string;
  };
  marriedStatus?: string | undefined;
  education?: string | undefined;
  gender?: string | undefined;
  bloodType?: string | undefined;
  religion?: string | undefined;
}

interface UserFileItemProps {
  label: string;
  value?: string;
}

interface UserInfoItemProps {
  label: string;
  value?: string;
}

export const UserInfoLeft = ({ userInfo, religion, gender }: UserInfoProps) => {
  return (
    <div className="space-y-3">
      <UserInfoItem label="NIK" value={userInfo?.nik} />
      <UserInfoItem label="Nama" value={userInfo?.name} />
      <UserInfoItem label="Telepon" value={userInfo?.telepon} />
      <UserInfoItem label="Email" value={userInfo?.email} />
      <UserInfoItem label="Tanggal Lahir" value={userInfo?.tgl_lahir} />
      <UserInfoItem label="Tempat Lahir" value={userInfo?.tempat_lahir} />
      <UserInfoItem label="Agama" value={religion} />
      <UserInfoItem label="Jenis Kelamin" value={gender} />
    </div>
  );
};

export const UserInfoRight = ({
  userInfo,
  education,
  bloodType,
  marriedStatus,
}: UserInfoProps) => {
  return (
    <div className="space-y-3">
      <UserInfoItem label="Pendidikan" value={education} />
      <UserInfoItem label="Status Kawain" value={marriedStatus} />
      <UserInfoItem label="Golongan Darah" value={bloodType} />
      <UserInfoItem label="Pekerjaan" value={userInfo?.pekerjaan} />
      <UserInfoItem label="Kecamatan" value={userInfo?.kecamatan} />
      <UserInfoItem label="Desa" value={userInfo?.desa} />
      <UserInfoItem label="RT" value={userInfo?.rt} />
      <UserInfoItem label="RW" value={userInfo?.rw} />
      <UserInfoItem label="Alamat" value={userInfo?.alamat} />
    </div>
  );
};

const DownloadButtonFile = ({ label, value }: UserFileItemProps) => {
  return (
    <div className="space-y-2 mt-3">
      <Button className="mt-2 w-[25vh] rounded-[20px] bg-neutral-50 hover:bg-neutral-100 shadow p-3 flex justify-around items-center">
        <Image
          src="/icons/download.svg"
          alt="download"
          width={24}
          height={24}
        />
        <p className="text-neutral-900">{label}</p>
      </Button>
    </div>
  );
};

const UserInfoItem = ({ label, value }: UserInfoItemProps) => {
  return (
    <div className="space-y-1">
      <h3 className="font-medium">{label}</h3>
      <p className="text-neutral-800">{value}</p>
    </div>
  );
};
