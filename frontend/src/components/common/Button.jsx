export default function Button({
  children,
  variant = 'primary', // primary | accent | outline | ghost | danger
  size, // 'sm' or default
  icon: Icon,
  iconPosition = 'right',
  as: Component = 'button',
  className = '',
  ...props
}) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {Icon && iconPosition === 'left' && <Icon />}
      {children}
      {Icon && iconPosition === 'right' && <Icon />}
    </Component>
  );
}
