/**
 * useDynamicMobileMenu
 * 
 * Returns the correct mobile menu component based on the active navigation variant.
 * This ensures desktop and mobile navigation are always in sync during A/B testing.
 */

import { useNavigationVariant } from "@/hooks/useNavigationVariant";
import { MobileMenuNew } from "@/components/MobileMenuNew";
import { MobileMenuV11 } from "@/components/navigation/MobileMenuV11";
import { MobileMenuV12 } from "@/components/navigation/MobileMenuV12";
import { MobileMenuV13 } from "@/components/navigation/MobileMenuV13";
import { MobileMenuV16 } from "@/components/navigation/MobileMenuV16";

interface DynamicMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Returns the appropriate mobile menu component based on active nav variant
 */
export const useDynamicMobileMenu = () => {
  const navVariant = useNavigationVariant();
  
  const DynamicMobileMenu = ({ isOpen, onClose }: DynamicMobileMenuProps) => {
    const variantId = navVariant.id;
    
    // Variants 1-10 (ultimate, variant-b to variant-j) -> MobileMenuNew (dynamic content)
    if (['ultimate', 'variant-b', 'variant-c', 'variant-d', 'variant-e', 
         'variant-f', 'variant-g', 'variant-h', 'variant-i', 'variant-j'].includes(variantId)) {
      return <MobileMenuNew isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-k (11. Simpel & Clean) -> MobileMenuV11
    if (variantId === 'variant-k') {
      return <MobileMenuV11 isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-l (12. Best-of-Breed) -> MobileMenuV12
    if (variantId === 'variant-l') {
      return <MobileMenuV12 isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-m (13. Progressive Disclosure) -> MobileMenuV13
    if (variantId === 'variant-m') {
      return <MobileMenuV13 isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-n (14. Aggressive Funnel) -> MobileMenuNew
    if (variantId === 'variant-n') {
      return <MobileMenuNew isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-o (15. ChatGPT Feedback v15) -> MobileMenuNew
    if (variantId === 'variant-o') {
      return <MobileMenuNew isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-p (16. SEO-Optimiert 2026) -> MobileMenuV16
    if (variantId === 'variant-p') {
      return <MobileMenuV16 isOpen={isOpen} onClose={onClose} />;
    }
    
    // variant-17 (17. NavigationV17) -> MobileMenuNew
    if (variantId === 'variant-17') {
      return <MobileMenuNew isOpen={isOpen} onClose={onClose} />;
    }
    
    // Default fallback: MobileMenuNew
    return <MobileMenuNew isOpen={isOpen} onClose={onClose} />;
  };
  
  return { DynamicMobileMenu, variantId: navVariant.id };
};

/**
 * Direct component export for simpler usage
 */
export const DynamicMobileMenu = ({ isOpen, onClose }: DynamicMobileMenuProps) => {
  const { DynamicMobileMenu: Menu } = useDynamicMobileMenu();
  return <Menu isOpen={isOpen} onClose={onClose} />;
};
