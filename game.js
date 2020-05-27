'use strict';

var IsAnimate = false, IsGame = false;
var MousePositionX, MousePositionY;                 // Позиция мыши по горизонтали и вертикали
var SavePositionX, SavePositionY;                   // Позиция мыши во время нажатия клавиши
var IsInitialize = false;                           // Инициализирована ли игра
const FieldSize = 4;                                // Размер поля
var DirectionCheck = [false, false, false, false];  //
var GameScore = 0;                                  //

// Игровое поле
var GameGrid = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];

/**
 * Основная логика игры
 * Определяет нажатие мыши, направление мыши. Создает блоки и анимирует их
 */
$(document).ready(function() {
    // Выполнить инициализацию
    if(!IsInitialize) {
         Initialize();
    }

    var $playfield = $('#playfield');       // Игровое поле
    var mousedown = false;                  // Нажата ли клавиша

    // Если клавиша нажата, запоминаем координаты мыши
    $playfield.unbind('mousedown').mousedown(function () {
        mousedown = true;

        SavePositionX = MousePositionX;
        SavePositionY = MousePositionY;
    });

    // Если клавиша отпущена, то выполняем основную логику игры
    $playfield.unbind('mouseup').mouseup(function () {
        mousedown = false;
        let IsFlipVertical = false;                             // Если переворачиваем по вертикали
        let IsRotateHorizontal = false, IsUp = false;           // Если вращаем по горизонтали. Направление вверх или вниз

        let LastGrid = GetCopyField(GameGrid);                  // Сохраняем поле перед изменением чтобы проверить получилось ли сдвинуть клетки

        if(!IsAnimate && !IsGame) {
            console.log("PLAY");
            IsAnimate = true;
            IsGame = true;

            setTimeout(Operation, 400, LastGrid);
            // Получаем направление мыши
            switch (GetDirection(MousePositionX, SavePositionX, MousePositionY, SavePositionY)) {
                // Если движение вправо
                case RIGHT_DIRECTION: {
                    console.log("RIGHT");
                    AnimateField(GameGrid, RIGHT_DIRECTION, 5);
                    setTimeout(AnimateField, 200, GameGrid, RIGHT_DIRECTION, 5);
                    DirectionCheck[RIGHT_DIRECTION] = true;
                    break;
                }

                // Если движение влево, то переворачиваем игровое поле
                case LEFT_DIRECTION: {
                    console.log("LEFT");
                    AnimateField(GameGrid, LEFT_DIRECTION, 5);
                    setTimeout(AnimateField, 200, GameGrid, LEFT_DIRECTION, 5);
                    FlipField(GameGrid);
                    IsFlipVertical = true;
                    DirectionCheck[LEFT_DIRECTION] = true;
                    break;
                }

                // Если движение вверх, то вращаем поле один раз
                case UP_DIRECTION: {
                    console.log("UP");
                    AnimateField(GameGrid, UP_DIRECTION, 5);
                    setTimeout(AnimateField, 200, GameGrid, UP_DIRECTION, 5);
                    GameGrid = GetRotateField(GameGrid);
                    IsRotateHorizontal = true;
                    IsUp = true;
                    DirectionCheck[UP_DIRECTION] = true;
                    break;
                }

                // Если движение вниз, то вращаем три раза
                case DOWN_DIRECTION: {
                    console.log("DOWN");
                    AnimateField(GameGrid, DOWN_DIRECTION, 5);
                    setTimeout(AnimateField, 200, GameGrid, DOWN_DIRECTION, 5);
                    GameGrid = GetRotateField(GameGrid);
                    GameGrid = GetRotateField(GameGrid);
                    GameGrid = GetRotateField(GameGrid);
                    IsRotateHorizontal = true;
                    DirectionCheck[DOWN_DIRECTION] = true;
                    break;
                }
            }

            // Выполняем действия по строкам
            for(let i = 0; i < GameGrid.length; i++) {
                GameGrid[i] = SlideRow(GameGrid[i]);            // Сдвигаем направо все числа
                GameGrid[i] = CombineRow(GameGrid[i]);          // Комбинируем одинаковые элементы
                GameGrid[i] = SlideRow(GameGrid[i]);            // Сдвигаем еще раз
            }

            // Если было переворачивание поля, то переворачиваем обратно
            if(IsFlipVertical) {
                FlipField(GameGrid);
                IsFlipVertical = false;
            }

            // Если было вращение поля, то возращаем обратно
            if(IsRotateHorizontal) {
                GameGrid = GetRotateField(GameGrid);
                if(IsUp) {
                    GameGrid = GetRotateField(GameGrid);
                    GameGrid = GetRotateField(GameGrid);
                }
                IsRotateHorizontal = false;
                IsUp = false;
            }
        } else {
            console.log("WAIT");
        }

        UpdateScore(GameScore);
    });
});

/**
 * Отслеживает позицию мыши
 */
document.addEventListener('mousemove', function (event) {
    MousePositionX = event.pageX;
    MousePositionY = event.pageY;
});

/**
 * Выполняет инициализацию. Добавляет первую клетку и отображает ее на поле
 */
function Initialize() {
    AddNumber(GameGrid);
    AddCell(GameGrid);
    IsInitialize = true;
}

/**
 * Функция операции. Определяет совершен ли ход. Добавляет клетку на поле в случае успешного хода
 * Если сходить невозможно высвечивается уведомление о конце игры
 * @param LastGrid - принимает предыдущее состояние поля
 */
function Operation(LastGrid) {
    // Если поле изменилось, значит можно играть
    if(CompareField(GameGrid, LastGrid)) {
        AddNumber(GameGrid);
        AddCell(GameGrid);
        DirectionCheck = [false, false, false, false];
    } else {
        console.log("CANT SLIDE");
        // Если невозможно двинуть поле во все 4 стороны, то игрок проиграл
        if(DirectionCheck[0] && DirectionCheck[1] && DirectionCheck[2] && DirectionCheck[3]) {
            console.log("YOU LOSE");
            var Lose = document.getElementById('lose');
            Lose.style.display = 'block';
        }
    }

    IsGame = false;
}

/**
 * Функция обновления счета на странице
 * @param Score - принимает игровой счет
 */
function UpdateScore(Score) {
    var ScoreText = document.getElementById('score');

    ScoreText.innerHTML = Score.toString();
}


