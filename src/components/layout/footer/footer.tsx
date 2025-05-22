/**
 * 底栏组件
 * 高度固定且不可拉伸
 * 文字横向和纵向都居中
 */
export function Footer() {
  return (
    <footer
      className="mt-8 sm:mt-12 md:mt-16 border-t border-border h-32 min-h-[8rem] max-h-[8rem] flex-shrink-0 flex-grow-0 w-full flex items-center justify-center"
      style={{ flexShrink: 0, flexBasis: '8rem' }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <p className="text-sm sm:text-base text-center text-muted-foreground">
          Copyright © 2025 iFluxArt · 斐流艺创
        </p>
      </div>
    </footer>
  );
}
