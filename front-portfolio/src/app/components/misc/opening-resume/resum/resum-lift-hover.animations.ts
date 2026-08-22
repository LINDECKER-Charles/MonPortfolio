import gsap from 'gsap';

/** Tweens appliqués à un enfant du conteneur survolé, résolu par sélecteur à chaque événement. */
export interface LiftHoverChildConfig {
  readonly selector: string;
  readonly hoverIn: gsap.TweenVars;
  readonly hoverOut: gsap.TweenVars;
}

/**
 * Valeurs GSAP d'un jeu d'interactions « lift » (hover/press/release) : chaque
 * composant du résumé fournit les siennes, la mécanique (kill + tween du
 * conteneur puis des enfants présents) est commune.
 */
export interface LiftHoverConfig {
  readonly hoverIn: gsap.TweenVars;
  readonly hoverOut: gsap.TweenVars;
  readonly press: gsap.TweenVars;
  readonly release: gsap.TweenVars;
  readonly children?: readonly LiftHoverChildConfig[];
}

export interface LiftHoverAnimations {
  readonly hoverIn: (container: HTMLElement) => void;
  readonly hoverOut: (container: HTMLElement) => void;
  readonly press: (container: HTMLElement) => void;
  readonly release: (container: HTMLElement) => void;
}

export function createLiftHoverAnimations(config: LiftHoverConfig): LiftHoverAnimations {
  const children = config.children ?? [];

  const animateHover = (container: HTMLElement, phase: 'hoverIn' | 'hoverOut'): void => {
    const targets = children.map((child) => container.querySelector(child.selector));

    if (children.length > 0) {
      gsap.killTweensOf([container, ...targets]);
    } else {
      gsap.killTweensOf(container);
    }

    gsap.to(container, config[phase]);

    children.forEach((child, index) => {
      const target = targets[index];
      if (target) {
        gsap.to(target, child[phase]);
      }
    });
  };

  const animateContainerOnly = (container: HTMLElement, vars: gsap.TweenVars): void => {
    gsap.killTweensOf(container);
    gsap.to(container, vars);
  };

  return {
    hoverIn: (container) => animateHover(container, 'hoverIn'),
    hoverOut: (container) => animateHover(container, 'hoverOut'),
    press: (container) => animateContainerOnly(container, config.press),
    release: (container) => animateContainerOnly(container, config.release),
  };
}
