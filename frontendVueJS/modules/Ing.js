window.Ing=  {
//== А - ширина в плане; b - width; h- height; L- long; a- protect.layer; Darm; Rb; Rbt; Kt_bet; Gb_2; minPer; Rs; Rsc
	$: function(id) {
		if(!(id instanceof Object)) id = id.indexOf('#') !== 0 ? '#' + id : id;
		// console.log('fix id = ', id);
		id = id instanceof jQuery ? id : $f(id);
		// console.log('Ing.$() = ', id);
		return id;
	},

	gt: function(id,def) {
		var r = this.$(id).val();
		return +r || r || def || 0;
	},

	A: function() {return this.gt('A')},
	b: function() {return this.gt('b')},
	h: function() {return this.gt('h')},
	a: function() {return this.gt('a')},
	DarmSort: [6,8,10,12,14,16,18,20,22,25,28,30,32],
	Darm: function(D) {return !D? this.gt('Darm')/10: this.gt(D)/10}, // mm->cm
	Rb: function() {return this.matSplit('bet')[1]/1000}, // кгс/см2->тс/см2
	Rbt: function() {return this.matSplit('bet')[2]/1000}, // кгс/см2->тс/см2
	Kt_bet: function() {return this.gt('Kt_bet',0.85)},
	Gb_2: function() {return this.gt('Gb_2',0.9)},
	minPer: function() {return this.gt('minPer')/100},
	matSplit: function(mat) {return this.gt(mat).split('|')},
	Rsc: function() {return this.matSplit('arm')[1]}, // тс/см2
	Rs: function() {return this.matSplit('arm')[2]}, // тс/см2
	Rsw: function() {return this.matSplit('arm')[3]}, // тс/см2



	h0: function() {return this.h()-this.a()}, // cm
	As: function(D) {return (this.Darm(D)!=0)? Math.PI*Math.pow(D? this.Darm(D):this.Darm(),2)/4: false}, // cm2
	Us: function() {return (this.As())? 2*Math.PI*this.Darm()/2: false}, // Периметр сечения арматуры - cm
	omega: function() {return this.Kt_bet()-0.8*this.Gb_2()*this.Rb()},
	// Граничная относительная высота сжатой зоны
	ksiR: function() {return (this.Gb_2()<1)? this.omega()/(1+this.Rsc()*(1-this.omega()/1.1)/5): this.omega()/(1+this.Rsc()*(1-this.omega()/1.1)/4)},

	Mi: function(e) {
		e = $().e.fix(e);
		var $t = $(e.target);
		if (!$t.attr('zakr')) return;
		e.preventDefault();
		e.stopPropagation();
		return (Ing.gt('#q') * Math.pow(Ing.gt('#L'), 2)/$t.attr('zakr')).toFixed(2);
	},

	mat: {
		bet_1: ['B7.5|45.9|4.3','B10|61.2|5.7','B15|86.6|7.6','B20|117|9.2','B25|148|9.7','B30|173|11.7','B35|199|13.3','B40|224|14.3'],
		Ktb_1: ['0.85','0.8','0.75'], // Коэф-т для бетонов
		Fb2_1: ['тяжелый или ячеистый|2|.01','мелкозернистый|1.7|.01','легкий|1.6|.02'], // φb2|β –коэффициент, принимаемый в зависимости от вида бетона
		arm_1: ['A240|2.19|2.19|1.73','A300|2.75|2.75|2.19','A400|3.62|3.62|2.9','A500|4.08|4.43|3.06','B500|3.67|4.23|3.06'],

		cr: function(mat, pref, pr_sost) { // Ing.mat.cr('bet');
			mat=mat||'bet'; pref=pref||2; pr_sost=pr_sost||1;
			matD= mat.substring(0,3);
			var dim= this[matD+"_"+pr_sost],
				$mat = Ing.$(mat);

			// console.log(mat, $mat);

			$mat.html('');

			for(var i=0; i<dim.length; i++) {
				$opt= $mat.cr('option',{});
				$opt.val(dim[i]);
				$opt.html(dim[i].split('|')[0]) ;
			};

			$mat.val(this[matD+"_"+pr_sost][pref]);
			//alert(pref)
		}
	},
	R: { //== Расчет армирования прямоугольного сечения
		M_izg: function() {return Ing.gt('M_izg')},
		Al_m: function() {return this.M_izg()*100/(Ing.Gb_2()*Ing.Rb()*Ing.b()*Math.pow(Ing.h0(),2))},
		ksi: function() {return 1-Math.sqrt(1-2*this.Al_m())},
		fi: function() {return (this.ksi()<=Ing.ksiR())? 1-0.5*this.ksi(): alert('Высота сечения недостаточна\n Расчет невозможен')},
		As: function() {return this.M_izg()*100/(Ing.Rs()*this.fi()*Ing.h0())},
		trass: function() {
			var trass= "h<sub>0</sub>= "+Ing.h0()+" см<br />";
			trass+= "ω= "+ Ing.omega() +"<br />";
			trass+= "α<sub>m</sub>= "+ Ing.R.Al_m() +"<br />";
			if(!isNaN(Ing.R.ksi())) trass+= "ξ= "+ Ing.R.ksi() +"<br />";
			trass+= "ξ<sub>R</sub>= "+ Ing.ksiR() +"<br />";
			trass+= "φ= "+ (Ing.R.fi() || 0) +" см<br />";
			trass+= "As*= "+ Ing.R.As() +" см<sup>2</sup><br />";
			return trass;
		},
		Per: function() { //== Площадь арматуры с учетом минимального процента армирования
			return Math.max(this.As(), Ing.minPer()*Ing.b()*Ing.h0());
		},
		ArmSt: function(N) { //== Раскладка по диаметрам
			var S= this.Per(),
			D= Math.sqrt(S/N*4/Math.PI)*10;
			function Sort () {
				for (var i=0; i < Ing.DarmSort.length; i++) {
					if(D > Ing.DarmSort[i]) continue;
					else return '<p>' + N + 'ø' + Ing.DarmSort[i] + '</p>';
				};
				return '<p class="red">более ' + N + 'ø' + Ing.DarmSort[Ing.DarmSort.length-1] + '</p>';
			};
			return Sort();
		}
	},
	Pr: { // Проверка армирования прямоугольного сечения
		As: function() {return Ing.gt('As_p')},
		Xr: function() {return Ing.ksiR()*Ing.h0();},
		X: function() {return Ing.Rs()*this.As()/(Ing.Gb_2()*Ing.Rb()*Ing.b())},
		trass: function() {
			var trass= "h<sub>0</sub>= "+Ing.h0()+" см<br />";
			trass+= "ω= "+ Ing.omega() +"<br />";
			trass+= "ξ<sub>R</sub>= "+ Ing.ksiR() +"<br />";
			return trass;
		},
		M_izg: function() {return (this.X()<=this.Xr())? (Ing.Rs()*this.As()*(Ing.h0()-this.X()/2)/100): alert('Прочность арматуры превышает\n прочность бетона сжатой зоны')}
	},
	Prod: { //== Проверка плиты на продавливание
		arm: false,
		alf: function() {return Ing.gt('alf')}, Dsw: function() {return Ing.Darm()}, Ssw: function() {return Ing.gt('Ssw')},
		Um: function() {return (Ing.A()-(-Ing.b()))*2+Ing.h0()*4},
		Asw: function() {return Math.PI*Math.pow(this.Dsw(),2)*this.Um()*Ing.h0()/(4*Math.pow(this.Ssw()/10,2)); },
		Fb: function() {return this.alf()*Ing.Rbt()*this.Um()*Ing.h0()},
		Fsw: function() {Fsw_ult=0.8*Ing.Rsw()*this.Asw(); return !this.arm? 0: (Fsw_ult>= 0.25*this.Fb())? Math.min(Fsw_ult,this.Fb()): 0},
		trass: function() {
			var trass= "h<sub>0</sub>= "+ Ing.h0() +" см<br />" + "Rbt= "+ Ing.Rbt().toFixed(5) +" тс/м<sup>2</sup><br />" + "Um= "+ Ing.Prod.Um().toFixed(1) +" см<br />";
			if (Ing.$('#pop_arm').css('display') === '') {
				trass+= "R<sub>sw</sub>= "+ Ing.Rsw() +" тс/м<sup>2</sup><br />";
				trass+= "F<sub>sw</sub>= "+ Ing.Prod.Fsw().toFixed(2) +" тс<br />";
				trass+= "F<sub>b</sub>= "+ Ing.Prod.Fb().toFixed(2) +" тс<br />";
			}
			return trass;
		},
		Fmax: function() {return (this.Fb()-(-this.Fsw())).toFixed(1)}
	},
	Pop: { //== Проверка наклонных сечений на действие поперечной силы
		Fb1: function() {return 1-Ing.gt('Fb2').split('|')[2]*Ing.Rb()}, // размерность???
		Fw1: function() {return Math.min(1+5*Ing.As('Dsw')*Ing.gt('Kvo')/Ing.b()/(Ing.gt('Ssw')/10), 1.3)}, // влияние поперечных стержней
		Fif: function() {
			// console.log(Ing.gt('h_per'));
			return Math.min(.75 * 3 * Ing.gt('h_per') / Ing.b() / Ing.h0(), .5);
		}, // учет сжатых полок
		Fin: function() {return Math.min((Ing.gt('prednapr')<0)?-.2:.1*Ing.gt('prednapr')/(Ing.Rbt()*Ing.b()*Ing.h0()), (Ing.gt('prednapr')<0)?-.8:.5)}, // влияние продольных сил - растягивающие задавать отрицательными

		Mb: function() {
			// console.log(this.Fif(), this.Fin());
			return Ing.gt('Fb2').split('|')[1] * (1+this.Fif()+this.Fin()) * Ing.Rbt() * Ing.b() * Math.pow(Ing.h0(),2);
		},

		qsw: function() {
			var qsw= Ing.Rsw()*Ing.As('Dsw')*Ing.gt('Kvo')/(Ing.gt('Ssw')/10);
			return (qsw>= .25*Ing.Rbt()*Ing.b()) ? qsw : 0;
		},
		// Расчет по Пособию
		c: function() {var c= Math.min(Math.sqrt(this.Mb()/.75/this.qsw()),3*Ing.h0());
			return Math.max(c,Ing.h0()) },
		Qb: function() {var Qb= Math.max(this.Mb()/this.c(), .5*Ing.Rbt()*Ing.b()*Ing.h0()); return Math.min(Qb, 2.5*Ing.Rbt()*Ing.b()*Ing.h0()) },
		Qsw: function() { return .75*this.qsw()*Math.min(this.c(),2*Ing.h0())},
		Q: function() { return Math.min(this.Qb()+this.Qsw(),.3*Ing.Rb()*Ing.b()*Ing.h0())},
		// Итерационный метод расчета по 10 сечениям
		ci: function() 	{ var cD=[];
			for(var c=Ing.h0(); c<=3*Ing.h0(); c+=.2*Ing.h0() ) {
				cD.push(c.toFixed(1))
			}; return cD;
		},

		Qbsw: function() {
			var QD= [];

			for(var i=0; i<this.ci().length; i++) {
				QD[i]= Math.max(.5*Ing.Rbt()*Ing.b()*Ing.h0(), Math.min(this.Mb()/this.ci()[i], 2.5*Ing.Rbt()*Ing.b()*Ing.h0())); // Qb

				// console.log(Ing.Rbt(), Ing.b(), Ing.h0());
				// console.log('this.Mb() = ' ,this.Mb(), this.ci()[i]);

				QD[i]+= .75*this.qsw()*Math.min(this.ci()[i],2*Ing.h0()); // Qsw
				QD[i]= QD[i].toFixed(1);
			};
			return QD;
		},

		Qi: function() {return Math.min.apply(.3*this.Fw1()*this.Fb1()*Ing.Rb()*Ing.b()*Ing.h0(),this.Qbsw())}
	},
	Ank: { // Анкеровка и перехлесты арматуры
		nu1D: {'A240':1.5,'B500':2,'A300':2.5,'A400':2.5,'A500':2.5},
		nu1: function() {for(var i in this.nu1D) {if (new RegExp(i).test(Ing.gt('arm'))) {return this.nu1D[i]} }; return 2.8; },
		nu2: function() {return (Ing.Darm()*10<=32)? 1: 0.9},
		Rbond: function() {return this.nu1()? this.nu1()*this.nu2()*Ing.Rbt(): false },
		L0an: function() {return Ing.Rs()*Ing.As()/(this.Rbond()*Ing.Us()) },
		alf: function() {return (Ing.$('pr100')[0].checked)? Ing.gt('napr_sost').split('|')[0]+'|2': Ing.gt('napr_sost')},
		Lan: function() {var Lan= this.nu1()? this.alf().split('|')[0]*this.L0an()*Ing.As()/Ing.As('Dfarm'): 0;
			Lan= Math.max(Lan,20,.3*this.L0an()); return Lan.toFixed(0) },
		Li: function() { var Li= this.nu1()? this.alf().split('|')[1]*this.L0an()*Ing.As()/Ing.As('Dfarm'): 0;
			Li=  Math.max(Li,25,.4*this.alf().split('|')[1]*this.L0an(),20*Ing.Darm());
			return Li.toFixed(0) }
	},

	Bet: {
		tcem: function() {return Ing.gt('tcem',400)},
		class: function() {return Ing.gt('bet_cl','B15')},
		prop_400: {"B7.5": "1 : 4.6 : 7.0|41 : 61|78", "B10": "1 : 3.5 : 5.7|32 : 50|64", "B15": "1 : 2.8 : 4.8|25 : 42|54", "B20": "1 : 2.1 : 3.9|19 : 34|43", "B25": "1 : 1.9 : 3.7|17 : 32|41", "B30": "1 : 1.2 : 2.7|11 : 24|31", "B35": "1 : 1.1 : 2.5|10 : 22|29"},
		prop_500: {"B7.5": "1 : 5.8 : 8.1|53 : 71|90", "B10": "1 : 4.5 : 6.6|40 : 58|73", "B15": "1 : 3.5 : 5.6|32 : 49|62", "B20": "1 : 2.6 : 4.5|24 : 39|50", "B25": "1 : 2.4 : 4.3|22 : 37|47", "B30": "1 : 1.6 : 3.2|14 : 28|36", "B35": "1 : 1.4 : 2.9|12 : 25|32"},
		prop: function() {for(var i in this['prop_'+this.tcem()]) {if (new RegExp(i).test(this.class())) {return this['prop_'+this.tcem()][i].split('|')} }; return ['','','']; }
	}
}

