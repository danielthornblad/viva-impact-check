import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

const SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

const loadScript = () => {
  if (typeof window === 'undefined') {
    return;
  }
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = TURNSTILE_SRC;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
};

const TurnstileWidget = React.forwardRef(({ siteKey, onVerify, action = 'default', className }, ref) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const reset = useCallback(() => {
    if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  useEffect(() => {
    loadScript();

    const tryRender = () => {
      if (!containerRef.current || !window.turnstile) {
        return;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        callback: (token) => {
          onVerify(token);
        },
        'error-callback': () => {
          onVerify(null);
        },
        'expired-callback': () => {
          onVerify(null);
        },
      });
      setIsReady(true);
    };

    if (typeof window !== 'undefined') {
      if (window.turnstile) {
        tryRender();
      } else {
        const onLoad = () => {
          tryRender();
        };
        window.addEventListener('turnstile-load', onLoad);
        const script = document.getElementById(SCRIPT_ID);
        if (script) {
          script.addEventListener('load', onLoad);
        }
        return () => {
          window.removeEventListener('turnstile-load', onLoad);
          if (script) {
            script.removeEventListener('load', onLoad);
          }
          if (window.turnstile && widgetIdRef.current !== null) {
            window.turnstile.remove(widgetIdRef.current);
          }
        };
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [siteKey, action, onVerify]);

  return <div ref={containerRef} className={className} aria-hidden={!isReady} />;
});

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
