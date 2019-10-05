/***********************************************************



	お天気APIテストプログラム
	*APIからJSON取得 phina.jsでcanvasにテキスト描画



***********************************************************/


/*********************

	天気API取得関数

**********************/
var MycityId = "270000"; //地域ID
var wData = null;

var xhr = new XMLHttpRequest();
var xhrCheck = false;	//XHR通信が成功したらフラグON

//お天気APIからデータ取得
function weatherXmlHttpReq( cityId )
{

	// 事前にアップしたPHPプログラムを介して、livedoorお天気WebサービスからJSONデータ取得する
	xhr.open( "GET",location.href + "/getWeather.php?city=" + cityId, true );

	xhr.onload = function(){

		wData = JSON.parse( this.responseText );	// JSON形式データを変換
		console.log( wData );				//ログで確認
		console.log( "XHR送信成功!!" );
		xhrCheck = true;
	}

	xhr.onerror = function() {
		console.log( "XHR送信失敗.." );
		wData = "";
	}

	xhr.send( null );
}



//phina.js をグローバル領域に展開
phina.globalize();

//定数
var FONT_SIZE = 52;

//場所idデータオブジェクトデータ
const cityData = [
	{
		id: "016010",
		name: "北海道",
	},
	{
		id: "020010",
		name: "青森",
	},
	{
		id: "030010",
		name: "岩手",
	},
	{
		id: "040010",
		name: "宮城",
	},
	{
		id: "020010",
		name: "青森",
	},
	{
		id: "050010",
		name: "秋田",
	},
	{
		id: "060010",
		name: "山形",
	},
	{
		id: "070010",
		name: "福島",
	},
	{
		id: "080010",
		name: "茨城",
	},
	{
		id: "090010",
		name: "栃木",
	},
	{
		id: "100010",
		name: "群馬",
	},
	{
		id: "110010",
		name: "埼玉",
	},
	{
		id: "120010",
		name: "千葉",
	},
	{
		id: "130010",
		name: "東京",
	},
	{
		id: "140010",
		name: "神奈川",
	},
	{
		id: "150010",
		name: "新潟",
	},
	{
		id: "160010",
		name: "富山",
	},
	{
		id: "170010",
		name: "石川",
	},
	{
		id: "180010",
		name: "福井",
	},
	{
		id: "190010",
		name: "山梨",
	},

]//長野県から



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

	@MyMainSceneクラス
	*ここから色々と選択していくメイン画面

**********************************************************/
phina.define("MyMainScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit();

		// 背景色
		this.backgroundColor = 'skyblue';

		//画像表示
		this.izuSprite = Sprite('izu').addChildTo( this );
		this.izuSprite.x = this.gridX.center();
		this.izuSprite.y = this.gridY.center();
		
		//お天気地域ID
		this.cityId = param.cityId;

		if( typeof this.cityId === 'undefined' ) this.cityId = "270000";//何もなかったら一応デフォルト値


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

		//セッティングボタン
		this.sButton = Button({
			text : 'SETTING',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center()+200,50 );


		//お天気ボタンがクリックされたら？
		this.wButton.onpointstart = function(){	

			weatherXmlHttpReq( self.cityId );	//天気json取得
		};

		//セッティングボタンがクリックされたら？
		this.sButton.onpointstart = function(){	
			//ボタンがクリックされたら？
			self.exit( "settingWeather" );
		};

		//画面をクリックしたら
		this.onpointstart = function( e ){
		};


	}, //end init


	//更新処理
	update: function( app ) {

		if( xhrCheck === true )
		{
			this.mainText = this.textToArray( wData.description.text ).replace(/\r?\n/g, '');
			this.mainText = this.mainText.split(",");
			this.exit("weatherScene",{wData: this.mainText});	//天気シーンに遷移
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


});//end MyMainScene class



/**********************************************************

	@weatherSceneクラス
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
				xhrCheck = false;
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



/**********************************************************

	@settingWeatherSceneクラス
	*天気の位置情報を変える

**********************************************************/
phina.define("settingWeatherScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function() {


		// 親クラス初期化
		this.superInit();



		// 背景色
		this.backgroundColor = 'skyblue';

		this.cityId;	//地域ID

		let self = this;//参照外れのため

		//戻るボタン
		this.bButton = Button({
			text : 'BACK',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center()-200,this.gridY.center()+300 );

		//更新ボタン
		this.updateButton = Button({
			text : '更新',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center()+200,this.gridY.center()+300 );


		//戻るボタンがクリックされたら？
		this.bButton.onpointstart = function() {

			let id = self.cityId;

			//テキストエリア削除
			let tarea = document.getElementById("textarea");
			tarea.parentNode.removeChild( tarea );

			//ボタンがクリックされたら？
			self.exit( "mainScene",{cityId: id} );	//メインシーンへ遷移
		};

		//更新ボタンが押されたら？
		this.updateButton.onpointstart = function() {

			self.cityId = self.getCityId( self.wTextArea.value );

			alert( "地域データを更新しました" );
		};


		//画面をクリックしたら
		this.onpointstart = function( e ) {
		};

		this.wLabel = Label({
			text: "地域:",
			fontSize: FONT_SIZE,
			stroke: null,
			fill: "#fff",

		}).addChildTo( this )
			.setPosition( this.gridX.center()-80, this.gridY.center()+10 );


		this.wTextArea = createInput().setTextarea( this,200,300,450 );//地域入力Input生成


	}, //end init


	//更新処理
	update: function( app ) {

	}, //end update


	//地域ID取得関数
	getCityId: function( text ) {
		
		let id;
		let data = cityData;

		let len = data.length;

		( len ).times( function( i ){

			if( text === data[i].name )
			{
				id = data[i].id;

			}
		});

		return id;

	},//end getCityId


});//end settingWeatherScene class



/***************************************************

	@メイン処理

***************************************************/
phina.main( function() {

	var dom = document.createElement('div');
	  
	var resize = function(){
		var e = app.domElement;
		var c = app.canvas;
		var s = e.style;
		var ds = dom.style;
		var rect = e.getBoundingClientRect();
		ds.width = 0;
		ds.height= 0;
		ds.position = 'absolute';
		ds.left = rect.left + 'px';
		ds.top = rect.top + 'px';
		var rate = parseInt(s.width) / c.width;
		ds.transform = 'scale(' + rate + ',' + rate + ')';
	};

	window.addEventListener('resize', resize);
	Scene.prototype.baseDom = dom;

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

		   {
			className: 'settingWeatherScene',
			label: 'settingWeather',
		   },

		]

	});

	app.baseDom = dom;

	// 実行
	app.run();

	resize();
	app.domElement.parentNode.insertBefore(dom, app.domElement.nextSibling);

});



/***************************************************

	@LabelRectクラス
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

/***************************************************

	@createInputクラス

	*テキストエリア入力inputを生成する
	**setTextarea:(_this,width,left,top)
	  *_this...thisを引数で一応取得

***************************************************/
phina.define("createInput", {

	init: function(){
	},

	setTextarea: function( _this,width,left,top ){

		let dom = _this.baseDom;	//DOM操作用
		let input = document.createElement('textarea');
		
		input.id = "textarea";	//id設定
		input.getAttribute('text');

		let s = input.style;

		//テキスト入力のデザイン
		//let label = _this.wLabel;

		s.width = width + 'px';
		s.height = '60px';
		s.position = 'absolute';
		s.margin = '8px';
		s.left = left + 'px';
		s.top = top + 'px';
		s.fontSize = FONT_SIZE + 'px';
		//s.fontFamily = Label.defaults.fontFamily;
		s.backgroundColor = '#FFFFFF';
		s.border = '2px solid #222222';
		dom.appendChild( input );
		


		//s.lineHeight = label.lineHeight;
		s.overflowY = 'hidden';

		input.oninput = function(){
			input.onscroll();
		};
		    
		input.onscroll = function(){
			//label.scrollY = this.scrollTop;
		};

		return input;	//テキストエリアvalueのために値を返しておく

	},//end setTextarea
});


