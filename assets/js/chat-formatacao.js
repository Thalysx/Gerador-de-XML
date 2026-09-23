// Deliberately limited formatting: all source text is escaped, no HTML or links.
function formatarRespostaIa(value) {
  const lines=String(value??'').replace(/\r\n?/g,'\n').split('\n');
  const inline=text=>escapeHtml(text).replace(/`([^`]+)`|\*\*([^*]+)\*\*/g,(_,code,bold)=>code?`<code>${code}</code>`:`<strong>${bold}</strong>`);
  const cells=line=>line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(s=>s.trim());
  const output=[];
  for(let i=0;i<lines.length;) {
    const line=lines[i];
    if(!line.trim()){i++;continue;}
    if(/^\s*```/.test(line)) {
      const code=[];i++;
      while(i<lines.length&&!/^\s*```/.test(lines[i]))code.push(lines[i++]);
      if(i<lines.length)i++;
      output.push(`<pre tabindex="0" aria-label="Trecho de código"><code>${escapeHtml(code.join('\n'))}</code></pre>`);continue;
    }
    if(line.includes('|')&&lines[i+1]?.includes('|')&&cells(lines[i+1]).every(c=>/^:?-{3,}:?$/.test(c))) {
      const headings=cells(line);i+=2;const rows=[];
      while(i<lines.length&&lines[i].trim()&&lines[i].includes('|')) {
        const row=cells(lines[i++]);rows.push('<tr>'+headings.map((_,j)=>`<td>${inline(row[j]||'')}</td>`).join('')+'</tr>');
      }
      output.push(`<div class="ia-table-scroll" tabindex="0" role="region" aria-label="Tabela da resposta"><table><thead><tr>${headings.map(h=>`<th scope="col">${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`);continue;
    }
    if(/^\s*(?:[-*]|\d+\.)\s+/.test(line)) {
      const ordered=/^\s*\d+\./.test(line),tag=ordered?'ol':'ul';const items=[];
      const pattern=ordered?/^\s*\d+\.\s+/:/^\s*[-*]\s+/;
      while(i<lines.length&&pattern.test(lines[i]))items.push(`<li>${inline(lines[i++].replace(pattern,''))}</li>`);
      output.push(`<${tag}>${items.join('')}</${tag}>`);continue;
    }
    if(/^#{1,6}\s+/.test(line)){output.push(`<p class="ia-heading"><strong>${inline(line.replace(/^#{1,6}\s+/,''))}</strong></p>`);i++;continue;}
    output.push(`<p>${inline(line)}</p>`);i++;
  }
  return output.join('');
}
