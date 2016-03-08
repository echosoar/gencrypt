/*
 * Gencrypt Data Encryption Standerd by JavaScript
 * version:0.0.1
 * author:echosoar
 * website:http://iwenku.net
 */
(function(obj,undefined){
	if(obj.desEncode){
		return;
	}
	var replacementAtSKFirstToC=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,29,51,43,35,27,19,11,3,60,52,44,36];
	var replacementAtSKFirstToD=[63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
	var replacementAtSKSecond=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
	var circulateToLeftAtSK=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
	var initialReplacementIP=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
	var selectE=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
	var S1=[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],
			[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],
			[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],
			[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]
		];
	var S2=[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],
			[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],
			[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],
			[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]
		];
	var S3=[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],
			[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],
			[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],
			[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]
		];
	var desEncode = function (original,key){
		if(original==null||key==null){
			return;
		}
		var res=extToArr(original);
		var keyArr=extToArr(key);
		
		for(var i=0;i<keyArr.length;i++){
			res=encode(res,keyArr[i]);
		}
		
		//console.log(res);
	}
	function secretKey(originalKey){//子密钥生成
		if(originalKey.length!==64){
			return false;
		}
		var C=[[]],D=[[]],K=[],i,j;
		for(i=0;i<28;i++){
			C[0][i]=originalKey[replacementAtSKFirstToC[i]-1];
			D[0][i]=originalKey[replacementAtSKFirstToD[i]-1];
		}
		for(i=0;i<16;i++){
			C[i+1]=arrToLeft(C[i],circulateToLeftAtSK[i]-1);
			D[i+1]=arrToLeft(D[i],circulateToLeftAtSK[i]-1);
			var temAnd=C[i+1].concat(D[i+1]);
			K[i]=[];
			for(j=0;j<48;j++){
				K[i][j]=temAnd[replacementAtSKSecond[j]-1];
			}
		}
		return K;
	}
	function parseToBinary(str){//转换为2进制，4个字符一组
		var i=0,result=[];
		while(true){
			var temp=str.charCodeAt(i++);
			if(temp){
				var tempStr=temp.toString(2);
				var tempLen=tempStr.length;
				for(var j=0;j<16;j++){
					result[(i-1)*16+j]=tempLen>j?parseInt(tempStr[j]):0;
				}
			}else{
				break;
			}
		}
		for(;i<5;i++){
			for(var j=0;j<16;j++){
				result.push(0);
			}
		}
		return result;
	}
	
	function extToArr(str){//4个字符一组切分方法
		var res=[],i=0;
		var count=parseInt(str.length/4);
		var remainder=str.length%4;
		for(;i<count;i++){
			res[i]=parseToBinary(str.substring(i*4,i*4+4));
		}
		if(remainder>0){
			res[i]=parseToBinary(str.substring(i*4,i*4+remainder));
		}
		return res;
	}
	
	function arrToLeft(arr,size){//循环左移
		var res=[];
		var len=arr.length;
		for(var i=0;i<len-size;i++){
			res[i]=arr[i+size];
		}
		for(;i<len;i++){
			res[i]=arr[i-len+size];
		}
		return res;
	}
	
	function encode(arr,key){//DES加密主函数
		if(!arr||!key){return false;}
		key=secretKey(key);
		var res=[],L=[],R=[],i=0,j,m;
		for(;i<arr.length;i++){
			L[i]=[[]],R[i]=[[]];
			for(m=0;m<32;m++){
				L[i][0][m]=arr[i][initialReplacementIP[m]-1];
			}
			for(;m<64;m++){
				R[i][0][m-32]=arr[i][initialReplacementIP[m]-1];
			}
			for(j=1;j<=16;j++){
				L[i][j]=R[i][j-1];
				R[i][j]=ext(L[i][j-1],R[i][j-1],key[j-1]);
			}
		}
	}
	
	function ext(L,R,key){
		var temKey=[];
		for(var i=0;i<48;i++){
			temKey[i]=parseInt(R[selectE[i]-1]+key[i])%2;
			
		}
		
	
		return temKey;
		
	}
	obj.des_encode=obj.desEncode=desEncode;
})(this);

desEncode("gy","天安门");