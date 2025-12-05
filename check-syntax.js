const fs = require('fs');
const path = require('path');

function checkSyntax(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        new Function(content);
        console.log(`${filePath}: Syntax OK`);
    } catch (error) {
        console.error(`${filePath}: Syntax Error`);
        console.error(`Error: ${error.message}`);
        console.error(`Line: ${error.lineNumber}`);
        console.error(`Column: ${error.columnNumber}`);
        
        // 显示错误位置附近的代码
        const lines = content.split('\n');
        const startLine = Math.max(0, error.lineNumber - 5);
        const endLine = Math.min(lines.length, error.lineNumber + 5);
        
        console.error('\nContext:');
        for (let i = startLine; i < endLine; i++) {
            const lineNum = i + 1;
            const prefix = lineNum === error.lineNumber ? '>> ' : '   ';
            console.error(`${prefix}${lineNum}: ${lines[i]}`);
            if (lineNum === error.lineNumber) {
                console.error(`   ${' '.repeat(error.columnNumber)}^`);
            }
        }
    }
}

// 检查main.js文件
checkSyntax(path.join(__dirname, 'js', 'main.js'));
