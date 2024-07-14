import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    aktalahir: string;
    foto: string;
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

interface UserInfoItemProps {
  label: string;
  value?: string;
}

interface UserFileItemProps {
  label: string;
  value: string;
}

export const UserInfoLeft = ({ userInfo, religion, gender }: UserInfoProps) => {
  console.log(userInfo);
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
      <h3 className="text-lg font-semibold">Dokumen Pendukung</h3>
      <div className="space-y-3">
        <h3 className="font-medium">Foto</h3>
        {userInfo?.foto ? (
          <DownloadButtonFile label="Foto" value={userInfo?.foto} />
        ) : (
          <p>Tidak ada</p>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-medium mt-3">KTP</h3>
        {userInfo?.filektp ? (
          <DownloadButtonFile label="ktp" value={userInfo?.filektp} />
        ) : (
          <p>Tidak ada</p>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-medium">KK</h3>
        {userInfo?.filekk ? (
          <DownloadButtonFile label="Foto" value={userInfo?.filekk} />
        ) : (
          <p>Tidak ada</p>
        )}
      </div>
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
      <br />
      <div className="space-y-3">
        <h3 className="font-medium">Akta Lahir</h3>
        {userInfo?.aktalahir ? (
          <DownloadButtonFile label="akta" value={userInfo?.aktalahir} />
        ) : (
          <p>Tidak ada</p>
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-medium">Ijazah Terakhir</h3>
        {userInfo?.fileijazahlain ? (
          <DownloadButtonFile label="ktp" value={userInfo?.fileijazahlain} />
        ) : (
          <p>Tidak ada</p>
        )}
      </div>
    </div>
  );
};

const DownloadButtonFile = ({ label, value }: UserFileItemProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-full h-full mb-3">
          <Image src={value} alt={label} width={160} height={160} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[50%] h-full overflow-auto">
        <div className="w-full h-full p-4">
          <Image src={value} alt={label} width={1000} height={1000} />
        </div>
      </DialogContent>
    </Dialog>
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
