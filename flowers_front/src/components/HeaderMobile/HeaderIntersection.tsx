
interface HeaderIntersectionProps {
    logoUrl: string;
    name: string;
}

export const HeaderIntersection: React.FC<HeaderIntersectionProps> = ({logoUrl, name}) => {
    return (
        <header className="admin-header bg-accent-color">
            <div className="admin-header-content">
                <a href="/" className="admin-logo" aria-label="На главную страницу">
                {!logoUrl ? (
                    <h2>{name}</h2>
                ) : (
                    <img src={logoUrl} alt="Логотип" className="logo-image" />
                )}
            </a>
            </div>
        </header>
    );
};
