import { Button } from '../ui/button';
import { ASSETS } from '../../utils/assets';

export default function LandingHeader() {
  const handleStartClick = () => {
    // Scroll to the email input section on the home page
    const emailSection = document.getElementById('landing-email');
    if (emailSection) {
      emailSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus the email input after scrolling
      setTimeout(() => {
        const emailInput = emailSection.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput) {
          emailInput.focus();
        }
      }, 500);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={ASSETS.logo} alt="Shanju" className="h-8 w-auto" />
        </div>

        <Button size="sm" onClick={handleStartClick}>
          Start for free
        </Button>
      </div>
    </header>
  );
}
