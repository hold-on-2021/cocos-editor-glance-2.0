var e={NONE:0,UP:1,LEFT:2,DOWN:3,RIGHT:4,getBlobOutlinePoints:function(t,a,n,r){e.data=t,e.width=a,e.height=n,e.loop=r;var p=e.getFirstNonTransparentPixelTopDown(),s=e.walkPerimeter(p.x,p.y);return e.width=null,e.height=null,e.data=null,e.loop=null,s},getFirstNonTransparentPixelTopDown:function(){var t,a,n=e.data,r=e.width,p=e.height,s=0;for(t=0;t<p;t++)for(a=0;a<r;a++,s+=4)if(n[s+3]>0)return{x:a,y:t};return null},walkPerimeter:function(t,a){t<0&&(t=0),t>e.width&&(t=e.width),a<0&&(a=0),a>e.height&&(a=e.height);var n=t,r=a,p=[cc.v2(n,r)];do{switch(e.step(n,r,e.data),e.nextStep){case e.UP:r--;break;case e.LEFT:n--;break;case e.DOWN:r++;break;case e.RIGHT:n++}n>=0&&n<=e.width&&r>=0&&r<=e.height&&p.push(cc.v2(n,r))}while(n!==t||r!==a);return e.loop&&p.push(cc.v2(n,r)),p},step:function(t,a,n){var r=e.width,p=4*r,s=(a-1)*p+4*(t-1),i=t>0,c=t<r,h=a<e.height,o=a>0;switch(e.upLeft=o&&i&&n[s+3]>0,e.upRight=o&&c&&n[s+7]>0,e.downLeft=h&&i&&n[s+p+3]>0,e.downRight=h&&c&&n[s+p+7]>0,e.previousStep=e.nextStep,e.state=0,e.upLeft&&(e.state|=1),e.upRight&&(e.state|=2),e.downLeft&&(e.state|=4),e.downRight&&(e.state|=8),e.state){case 1:e.nextStep=e.UP;break;case 2:case 3:e.nextStep=e.RIGHT;break;case 4:e.nextStep=e.LEFT;break;case 5:e.nextStep=e.UP;break;case 6:e.previousStep==e.UP?e.nextStep=e.LEFT:e.nextStep=e.RIGHT;break;case 7:e.nextStep=e.RIGHT;break;case 8:e.nextStep=e.DOWN;break;case 9:e.previousStep==e.RIGHT?e.nextStep=e.UP:e.nextStep=e.DOWN;break;case 10:case 11:e.nextStep=e.DOWN;break;case 12:e.nextStep=e.LEFT;break;case 13:e.nextStep=e.UP;break;case 14:e.nextStep=e.LEFT;break;default:e.nextStep=e.NONE}}};module.exports=e;