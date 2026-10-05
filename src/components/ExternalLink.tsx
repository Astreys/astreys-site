import type { AnchorHTMLAttributes, ReactNode } from 'react';

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'rel' | 'target'> {
  href: string;
  children: ReactNode;
}

/**
 * Links off-site open in the same tab — the visitor decides where links open,
 * and the back button keeps working. `noopener` is set regardless, so a link
 * changed to open a new tab later cannot hand the destination `window.opener`.
 * No `noreferrer`: my own products are glad to see where a visit came from.
 */
export function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  return (
    <a href={href} rel="noopener" {...rest}>
      {children}
    </a>
  );
}
