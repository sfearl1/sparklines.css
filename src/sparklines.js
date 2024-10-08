registerPaint('sparklines', class {
    static get inputProperties() {
      return [
        '--chart-type', '--chart-color', '--chart-color-gradient', '--chart-data',
        '--chart-width', '--chart-height', '--max-data-points', '--bar-width', '--line-width', '--fill-type', '--fill-opacity', '--gradient-opacity', '--padding-vertical', '--padding-horizontal'
      ];
    }
  
    paint(ctx, geom, properties) {
      const type = properties.get('--chart-type').toString().trim().replace(/"/g, '');
      const color = properties.get('--chart-color').toString().trim() || 'rgba(0,0,0,0.5)';
      
      const barWidth = parseInt(properties.get('--bar-width').toString().trim()) || 2;
      const lineWidth = parseInt(properties.get('--line-width').toString().trim()) || 1;
      
      const fillType = properties.get('--fill-type').toString().trim() || 'none';
      const fillOpacity = parseFloat(properties.get('--fill-opacity').toString().trim()) || 0.5;
      const gradientOpacity = parseFloat(properties.get('--gradient-opacity').toString().trim()) || 0.5;
      
      const paddingVertical = Math.min(parseInt(properties.get('--padding-vertical').toString().trim()), 20) || 0;
      const paddingHorizontal = Math.min(parseInt(properties.get('--padding-horizontal').toString().trim()), 20) || 0;
  
      const width = geom.width - 2 * paddingHorizontal;
      const height = geom.height - 2 * paddingVertical;

      const xOffset = paddingHorizontal;
      const yOffset = paddingVertical;
  
      const data = properties.get('--chart-data').toString().trim().split(',').map(Number);
      const maxDataPoints = parseInt(properties.get('--max-data-points').toString().trim()) || data.length;
      const trimmedData = data.slice(-maxDataPoints);

      const total = trimmedData.length;
      const max = Math.max(...trimmedData);

      const xStep = width / total;
      const yStep = max / height;
      let x = xOffset;
      let y = yOffset + height - (trimmedData[0] / yStep);
  
      ctx.clearRect(0, 0, geom.width, geom.height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = type === 'bar' ? barWidth : lineWidth;
      ctx.moveTo(x, y);
  
      for (let i = 1; i < total; i++) {
        x = xOffset + i * xStep;
        y = yOffset + height - (trimmedData[i] / yStep);
        if (type === 'bar') {
          ctx.moveTo(x, yOffset + height);
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
  
      if (type === 'line' && fillType !== 'none') {
        ctx.lineTo(xOffset + width, yOffset + height);
        ctx.lineTo(xOffset, yOffset + height);
        ctx.closePath();
        if (fillType === 'solid') {
          ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${fillOpacity})`;
        } else if (fillType === 'gradient') {
          const gradient = ctx.createLinearGradient(0, yOffset, 0, yOffset + height);
          gradient.addColorStop(0, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${gradientOpacity})`);
          gradient.addColorStop(1, `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0)`);
          ctx.fillStyle = gradient;
        }
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });