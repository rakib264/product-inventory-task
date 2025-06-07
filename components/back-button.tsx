'use client';

import Link from 'next/link';
import { Button } from 'react-day-picker';

interface BackButtonProps {
  href: string;
}

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button>Back to Products</Button>
    </Link>
  );
} 