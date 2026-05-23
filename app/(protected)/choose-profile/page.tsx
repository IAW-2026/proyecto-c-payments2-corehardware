import Link from "next/link";

export default function ChooseProfilePage() {
  return (
    <div>
        <div>Choose profile</div>
        <br />
        <Link href="/buyer">Buyer</Link>
        <br />
        <Link href="/seller">Seller</Link>
    </div>
  );
}