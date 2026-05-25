import { ImageResponse } from 'next/og';

export const alt = "拜拜小怪 app preview";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const appName = "拜拜小怪";
const description = "一款游戏化情绪陪伴应用。用命名、回血和出招三个轻量步骤，打跑拖延、压力和脑雾。";
const icon = "🎯";

function isImageIcon(value: string) {
  return value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://');
}

export default function Image() {
  const fallbackGlyph = appName.trim().slice(0, 1).toUpperCase() || 'E';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F7F4EE',
          color: '#1D1B18',
          padding: '76px',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: 40,
              background: '#FFFFFF',
              border: '1px solid #E4DED4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginRight: 44,
            }}
          >
            {isImageIcon(icon) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={icon}
                alt=""
                width="168"
                height="168"
                style={{ width: 168, height: 168 }}
              />
            ) : (
              <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1 }}>
                {icon || fallbackGlyph}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: 0 }}>
              {appName}
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                color: '#5F5A52',
                marginTop: 24,
                maxWidth: 760,
              }}
            >
              {description}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, color: '#8A8176' }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: '#FF6B2C',
              marginRight: 14,
            }}
          />
          拜拜小怪
        </div>
      </div>
    ),
    size,
  );
}
