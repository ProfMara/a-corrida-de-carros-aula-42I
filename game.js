class Game{
    //definir as propriedades do objeto
    constructor(){
        this.botao = createButton("REINICIAR");
        this.titulo = createElement("h2");
        this.lugar1 = createElement("h2");
        this.lugar2 = createElement("h2");

    }
    posicionarElementos(){
        //definir a posição do botão
        this.botao.position(width*0.66,100);
        //definir a posição dos textos
        this.titulo.position(width*0.33,100);
        this.lugar1.position(width*0.33,150);
        this.lugar2.position(width*0.33,200);
        
        //definir o texto do elemento
        this.titulo.html("Placar")

        //define o que acontece quando clica no botão
        this.botao.mousePressed(()=>{
            //escreve no banco de dados
            database.ref("/").set({
            //define os valores do banco de dados
              carsAtEnd:0, gameState:0, playerCount:0, players:{}
            })
            //reiniciar a página
            window.location.reload();
        })

    
    }
    


    addSprites(grupo, imagem, tamanho, quantidade){
        //repete "quantidade" vezes
        for(var i = 0; i < quantidade; i++){
            //atribui um número aleatório X🔻🔻
            var x = random(width*0.33,width*0.66);
            //atribui um número aleatório na variável Y
            var y = random(-height*4.5, height-100);
            var sprite = createSprite(x, y);
            //add imagens 
            sprite.addImage(imagem);
            //define tamanho
            sprite.scale = tamanho;
            //add a sprite no grupo
            grupo.add(sprite);

        }
    }

    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        player.getCount();

        car1 = createSprite(width/2-100, height-100)
        car1.addImage("carro", carimg1);
        car1.scale = 0.07;

        car2 = createSprite(width/2+100, height-100)
        car2.addImage("carro", carimg2);
        car2.scale = 0.07;
        //agrupa os carrinhos na mesma variável
        cars = [car1, car2];
        //criar o grupo das moedas
        coins = new Group();
        fuels = new Group();
        //criar grupo de obstaculos

        var oPos = [
            {x: width/2 + 250, y: height - 800},
            {x: width/2 - 250, y: height - 1300},
            {x: width/2 + 250, y: height - 1800},
            {x: width/2 - 180, y: height - 2300}
        ]
        var oPos2 = [
            {x: width/2 - 180, y: height - 3300},
            {x: width/2 + 180, y: height - 3300},
            {x: width/2 + 250, y: height - 3800},
            {x: width/2 - 150, y: height - 4300}
        ]
        this.addSprites(coins, coinImg, 0.25, 30);
        this.addSprites(fuels, fuelImg, 0.015, 30);
        

    }
    


    play(){
        form.esconder();
        Player.getInfo();
        this.posicionarElementos();
        if (allPlayers !== undefined){
            image (pista, 0, -height*4.5, width, height*6)
            player.getCarsAtEnd()
            var i = 0;
            for(var p in allPlayers){
                //pega o valor do banco de dados
                var x = allPlayers[p].posicaoX;
                var y = height - allPlayers[p].posicaoY;
                //atribui o valor na sprite do pc local
                cars[i].position.x = x;
                cars[i].position.y = y;
                i++;
                if(player.indice == i){
                    //definir a posição da câmera
                    camera.position.y = y;
                    textSize(25);
                    fill ("red");
                    textAlign("center");
                    //mostrar o nome do jogador
                    text (allPlayers[p].nome,x, y-80 )
                    this.mostrarPlacar();
                    //mostrar combustível
                    this.showFuelBar()
                    this.handleCoins(i);
                    this.pegarComb(i);
                    var linhaChegada = height*5.5;
                    if(player.posY > linhaChegada){
                        player.rank++;
                        player.update();
                        //atualizar o banco de dados
                        Player.updateCarsAtEnd(player.rank);
                        //finalizar o jogo
                        gameState = 2;
                        this.gameOver();

                    }
                }
            }
            this.controlarCarro()
            drawSprites()
        }
        
    }

    controlarCarro(){
        //checa se pressionou para cima 🔺 UP
        if(keyDown(UP_ARROW)){
            player.posY += 10;
            player.update();
            this.movendo = true
        }
        //⏱ HORA DO DESAFIO!
        //programe para o jogador ir para a esquerda
        //◀◀ esquerda 🔺🟡 ◀ LEFT◀ 🟡🔺◀◀
        if(keyDown(LEFT_ARROW)){
            player.posX -= 10;
            player.update();
        }
        //▶▶ direita 🔺🟡RIGHT 🟡🔺▶▶ 
        if(keyDown(RIGHT_ARROW)){
            player.posX += 10;
            player.update();
        }
    }

    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }
    
    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state
        })
    }

    showFuelBar() {
        push();
        image(fuelImg, width / 2 - 130, height - player.posY - 250, 20, 20);
        fill("white");
        rect(width/2 -100,height-player.posY-250, 160, 20);
        fill("#ffc400");
        rect(width / 2 - 100, height - player.posY - 250, player.fuel, 20);
        noStroke();
        pop();
      }

      pegarComb(index) {
       
        if (player.fuel > 0 && this.movendo) {
          player.fuel -= 0.3;
        }
    
        if (player.fuel <= 0) {
          gameState = 2;
          this.gameOver();
        }
      }

    //MOSTRA O PLACAR: showLeaderBoard()
    mostrarPlacar(){
        var lugar1, lugar2;
        var players = Object.values(allPlayers)
        //situação 1: ninguém cruzou a linha de chegada
        if(players[0].rank == 0 && players[1].rank == 0){
            //1º lugar: players[0]
            lugar1 = players[0].rank 
            + "&emsp;"
            + players[0].nome
            + "&emsp;"
            + players[0].score

            //2º lugar: players[1]
            lugar2 = players[1].rank
            + "&emsp;"
            + players[1].nome
            + "&emsp;"
            + players[1].score

        }

        //situação 2: player[0] cruzou a linha de chegada 1º
        if(players[0].rank == 1){
            lugar1 = players[0].rank
            + "&emsp;"
            + players[0].nome
            + "&emsp;"
            + players[0].score;

            lugar2 = players[1].rank
            + "&emsp;"
            + players[1].nome
            + "&emsp;"
            + players[1].score
        }
        //situação 3: player[1] cruzou a linha de chegada 1º
        if(players[1].rank == 1){
            //1º lugar: players[1]
            lugar1 = players[1].rank 
            + "&emsp;"
            + players[1].nome
            + "&emsp;"
            + players[1].score

            //2º lugar: players[0]
            lugar2 = players[0].rank
            + "&emsp;"
            + players[0].nome
            + "&emsp;"
            + players[0].score
        }
        this.lugar1.html(lugar1);
        this.lugar2.html(lugar2);



    }
    //coletar moedas
    //lidar com moedas
    //segurar moedas
    //tirar moedas

    handleCoins(i){
        cars[i-1].overlap(coins, function(carro, collided){
            //remove a moeda
            collided.remove()
            //aumentar a pontuação
            player.score+=1;
            //escrever o novo valor no banco de dados
            player.update()
        });
        cars[i-1].overlap(fuels, function(carro, collided){
            //remove a moeda
            collided.remove()
            //aumentar a pontuação
            player.fuel = 160;
            //escrever o novo valor no banco de dados
            player.update()
        });

    }

    //🔻
    gameOver(){
        //checa se o player é LOOSER
        if(player.fuel<=0){
           //HUMILHAR ELE
           swal({
                title:"Que peninha 😔💥!",
                text:"Você perdeu....🙁💔!",
                //LINK DO GIF DE DERROTA
                imageUrl:"https://media.tenor.com/apsmxOrPaU4AAAAM/tom-and.gif",
                //VIRGULA🔻🔻🔻
                imageSize:'200x200',
                confirmButtonText:"Espere a partida reiniciar"
            }) 
        }else{
            swal({
                title:"Parabéns 👍🏻😃!",
                text:"Você ficou em " +player.rank+"º lugar 🏆",
                //LINK DO GIF DE VITÓRIA                                                  VIRGULA 🔻🔻🔻
                imageUrl:'https://i.pinimg.com/originals/da/ce/31/dace3173f25d696064bc17c60b0ad4a1.gif',
                confirmButtonText:"Ok!"
            })
        }
        
    }
        
    
}