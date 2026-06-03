/**
 * 统一的内容处理工具函数
 * 确保文章内容在各个地方显示一致
 */

/**
 * 从HTML中提取纯文本（用于预览）
 */
export function extractPlainText(html: string): string {
  if (!html) return '';
  
  // 移除HTML标签
  let text = html.replace(/<[^>]*>/g, '');
  
  // 处理HTML实体
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // 移除多余的空白字符
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * 获取文章预览文本
 * @param content 文章内容
 * @param maxLength 最大长度
 */
export function getArticlePreview(content: string, maxLength: number = 150): string {
  const plainText = extractPlainText(content);
  if (plainText.length <= maxLength) return plainText;
  
  // 截取到完整句子
  let endIndex = maxLength;
  const lastPunctuation = Math.max(
    plainText.lastIndexOf('。', endIndex),
    plainText.lastIndexOf('！', endIndex),
    plainText.lastIndexOf('？', endIndex),
    plainText.lastIndexOf('.', endIndex),
    plainText.lastIndexOf('!', endIndex),
    plainText.lastIndexOf('?', endIndex),
    plainText.lastIndexOf(' ', endIndex)
  );
  
  if (lastPunctuation > maxLength * 0.5) {
    endIndex = lastPunctuation + 1;
  }
  
  return plainText.substring(0, endIndex) + '...';
}

/**
 * 格式化文章内容用于显示
 * 处理空行、段落等
 */
export function formatContentForDisplay(content: string): string {
  if (!content) return '';
  
  // 检查是否是HTML格式
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  
  if (isHtml) {
    // HTML格式直接返回
    return content;
  }
  
  // 纯文本格式，转换为简单的HTML
  return content
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => `<p>${para}</p>`)
    .join('');
}

/**
 * 生成文章阅读时间
 */
export function calculateReadingTime(content: string): number {
  const plainText = extractPlainText(content);
  const words = plainText.length;
  // 中文阅读速度：约 300 字/分钟
  const readingTime = Math.ceil(words / 300);
  return Math.max(1, readingTime);
}
