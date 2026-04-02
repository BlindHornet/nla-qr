interface AvatarProps {
  firstName: string;
  lastName: string;
}

export function Avatar({ firstName, lastName }: AvatarProps) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
  return (
    <span
      aria-label={`${firstName} ${lastName}`}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 28,
        height: 28,
        borderRadius: 999,
        background: '#dbeafe',
        color: '#1d4ed8',
        fontSize: 12,
        fontWeight: 700
      }}
    >
      {initials}
    </span>
  );
}
