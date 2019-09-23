/***********************************************************



	お天気APIテストプログラム
	*APIからJSON取得 phina.jsでcanvasにテキスト描画



***********************************************************/


/*********************

	天気API取得関数

**********************/
var cityId = "270000";	//地域ID
var wData = null;

var xhr = new XMLHttpRequest();

function xmlHttpReq()
{
	// 事前にアップしたPHPプログラムを介して、livedoorお天気WebサービスからJSONデータ取得する
	xhr.open( "GET","http://localhost/test_weather/getWeather.php?city=" + cityId, true );

	xhr.onload = function(){
		wData = JSON.parse( this.responseText );	// JSON形式データを変換
		console.log( wData );				//ログで確認
		console.log( "XHR送信成功!!" );
	}

	xhr.send( null );
}



//phina.js をグローバル領域に展開
phina.globalize();

//定数
var FONT_SIZE = 52;


/******************************************

	アセット関連

******************************************/
//画像登録
const ASSETS = {
	//画像
	image:{
		'izu':'./images/1_izu.png',	//イズ画像
	},
};


/**********************************************************

	MyMainSceneクラス
	*ここから色々と選択していくメイン画面

**********************************************************/
phina.define("MyMainScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function() {


		// 親クラス初期化
		this.superInit();

		// 背景色
		this.backgroundColor = 'skyblue';

		//画像表示
		this.izuSprite = Sprite('izu').addChildTo( this );
		this.izuSprite.x = this.gridX.center();
		this.izuSprite.y = this.gridY.center();

		//お天気テキストエリア
		this.mainTexts = [];

		let self = this;//参照外れのため

		//お天気ボタン
		this.wButton = Button({
			text : 'WEATHER',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center(),800 );

		this.wButton.onpointstart = function(){
		
			//ボタンがクリックされたら？
self.wButton.text = "OK";
			//xmlHttpReq();	//天気json取得
			//self.mainText = self.textToArray( wData.description.text ).replace(/\r?\n/g, '');
			//self.mainText = self.mainText.split(",");
			//self.exit("weatherScene",{wData: self.mainText});	//天気シーンに遷移
		};


		//画面をクリックしたら
		this.onpointstart = function( e ){
		};


	}, //end init


	//更新処理
	update: function( app ) {


	}, //end update



	//テキストを指定文字で配列に分割
	textToArray: function( text ) {
		
		let cnt = 0;
		let texts = "";

		for( var i = 0; i < text.length; i++ )
		{
			texts += text[cnt];
			cnt ++;

			if( ( cnt % 30 ) === 0 ) texts += ",";

		}

		return texts;

	}, //end textToArray


});//end MyMainScene class



/**********************************************************

	weatherSceneクラス
	*天気を教えてくれる

**********************************************************/
phina.define("weatherScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		// 背景色
		this.backgroundColor = 'skyblue';

		//画像表示
		this.izuSprite = Sprite('izu').addChildTo( this );
		this.izuSprite.x = this.gridX.center();
		this.izuSprite.y = this.gridY.center();


		this.labelRect = LabelRect().addChildTo( this )
            		.setPosition( this.gridX.center(), this.gridY.center()+320 );


		this.labelRect.texts = param.wData;	//天気テキストを代入
		this.labelRect.textDrawFlg = true;
		this.labelRect.charaNameArea.text = "イズ";	//話す名前をセット

		//画面をクリックしたら
		this.onpointstart = function( e ){

		        let p = e.pointer;
			

			if( this.labelRect.textAll )
			{
				this.labelRect.nextText();
			}
			else
			{
				this.labelRect.showAllText();
			}

			//テキストを全部表示したら遷移
			if( this.labelRect.textDrawFlg === false )
			{
				this.exit("mainScene");
			}


		};

	}, //end init


	//更新処理
	update: function( app ) {

		if( this.labelRect.textDrawFlg )
		{
			this.labelRect.addChar();
		}
		
		if( this.labelRect.textAll )
		{
			this.labelRect.nextTriangle.show();
		}
		else
		{
			this.labelRect.nextTriangle.hide();

		}

	}, //end update


	//テキストを指定文字で配列に分割
	textToArray: function( text ) {
		
		let cnt = 0;
		let texts = "";

		for( var i = 0; i < text.length; i++ )
		{
			texts += text[cnt];
			cnt ++;

			if( ( cnt % 30 ) === 0 ) texts += ",";

		}

		return texts;

	}, //end textToArray


});//end weatherScene class


/***************************************************

	メイン処理

***************************************************/
phina.main( function() {

	xmlHttpReq();


	// アプリケーションを生成
	var app = GameApp({

		// MainScene から開始
		startLabel: 'mainScene',

		//アセット
		assets: ASSETS,

		//独自シーン
		scenes: [
		   {
			className: 'MyMainScene',
			label: 'mainScene',
		   },

		   {
			className: 'weatherScene',
			label: 'weatherScene',
		   },

		]

	});
	
	// 実行
	app.run();
});



/***************************************************

	LabelRectクラス
	*テキストを表示・送る

***************************************************/
phina.define("LabelRect", {

	// 継承
	superClass: 'RectangleShape',

	init: function() {
		
		this.superInit({
			cornerRadius: 5,
			width: 630,
			height: 300,
			stroke: "black",
			fill: "#ffffff"
		});
		
		
		//テキスト表示領域用クラス
		this.labelArea = LabelArea({
	                text: "",
	                width: 600,
	                height: 240,
	                fontSize: FONT_SIZE

                }).addChildTo( this );

		this.texts = [];
		this.textIndex = 0;
		this.charIndex = 0;
		this.textAll = false;
		this.textDrawFlg = false;	//テキストを描画するフラグ


		//次のテキストの合図マーク
		this.nextTriangle = TriangleShape({
			fill: "black",
			stroke: false,
			radius: FONT_SIZE / 4,

		}).addChildTo( this ).setPosition( this.labelArea.x,this.labelArea.bottom );
		this.nextTriangle.rotation = 180;
		this.nextTriangle.hide();


		//話しているキャラの名前を表示枠
		this.charaNameRect = RectangleShape({
			cornerRadius: 2,
			width: 200,
			height: 50,
			stroke: "black",
			fill: "#ffffff"

		}).addChildTo( this ).setPosition( this.x - 215,this.y - 180 );


		//話しているキャラの名前の描画エリア
		this.charaNameArea = LabelArea({
			text: "",
			width: 52,
			height: FONT_SIZE / 2,
			fontSize: FONT_SIZE / 2,

		}).addChildTo( this.charaNameRect );


	}, //end init


	showAllText: function(){

		let text = this.texts[this.textIndex];
		this.labelArea.text = text;
		this.textAll = true;
		this.charIndex = text.length;


	},//end showAllText


	clearText: function(){

    		this.labelArea.text = "";

	},//end clearText


	nextText: function(){

		this.clearText();

	        this.textIndex++;

		if( this.textIndex >= this.texts.length ) 
		{
			this.textDrawFlg = false;
			this.textIndex = 0;
			this.textAll = false;

			this.charaNameArea.text = "";
		}

	        this.charIndex = 0;
		
		if( this.textDrawFlg ) this.addChar();

	},// end nextText


	//テキストを一文字ずつ表示していく
	addChar: function() {

        	this.labelArea.text += this.getChar();

    	}, //end addChar


	//テキストを一文字ずつ取り出していく
	getChar: function () {

	        let text = this.texts[this.textIndex];

	        if ( text.length <= this.charIndex ) 
		{
	            this.textAll = true;
	            return "";

	        } 
		else 
		{

	            this.textAll = false;
	            return text[this.charIndex++];
	        }

    	}, //end getChar


});
