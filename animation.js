'use strict';

/**
 * Анимирует клетки, передвигая их в сторону движения
 * @param Field - игровое поле
 * @param Direction - направление движения
 * @param Time - скорость анимации
 * @param Callback - функция, которая выполнится после анимации
 */
function AnimateField(Field, Direction, Time, Callback) {
    var CellArray = document.getElementsByClassName('thing');

    var MoveElements = CountDistance(Direction, CellArray, Field);
    MoveCells(Direction, CellArray, MoveElements, Time);

    IsAnimate = false;

    if(Callback && typeof(Callback) === "function")
        Callback();
}

/**
 * Функция определяет какие клетки необходимо сдвинуть и на какую дистанцию
 * @param Direction - направление движения
 * @param CellArray - массив клеток
 * @param Field - игровое поле
 * @returns {[]} - возвращает массив объектов в котором: Elem - номер элемента, который необходимо сдвинуть,
 * X - позиция клетки по X, Y - позиция клетки по Y, Dest - Дистанция, на которую нужно сдвинуть клетку,
 * Move - на какое расстояние клетка сдвинулась, State - завершила ли клетка анимацию
 */
function CountDistance(Direction, CellArray, Field) {
    let MoveElements = [];                  // Клетки, которые необходимо сдвинуть
    let DontMoveElements = [];              // Номера строк в которых последующие клетки не должны сдвигаться

    for(let i = 0; i < CellArray.length; i++) {
        let PosX = parseInt(CellArray[i].style.left, 10);
        let PosY = parseInt(CellArray[i].style.top, 10);

        let CellX = PosX / 100;
        let CellY = PosY / 100;

        // Если клетка находится не в крайних позициях по направлению движения, то просчитываем анимацию
        if((Direction === RIGHT_DIRECTION && PosX !== 300) || (Direction === LEFT_DIRECTION && PosX !== 0) || (Direction === UP_DIRECTION && PosY !== 0) || (Direction === DOWN_DIRECTION && PosY !== 300)) {
            let Distance = 0;               // Дистанция, на которую необходимо сдвинуть клетку

            // Если направление движения направо и в этой строке можно двигать клетки
            if(Direction === RIGHT_DIRECTION && DontMoveElements.indexOf(CellY) == -1) {
                for(let j = CellX + 1; j < Field[CellY].length; j++) {
                    if(Field[CellY][j] === 0) {
                        Distance++;
                    } else {
                        // Если на пути стоит элемент, совпадающий по номеру с исходным
                        // Объединяем их и помечаем строку в которой последующие клетки учитываться не будут
                        if(Field[CellY][j] === Field[CellY][CellX]) {
                            Distance++;
                            DontMoveElements.push(CellY);
                        }

                        break;
                    }
                }
            }

            // Если направление движения налево и в этой строке можно двигать клетки
            if(Direction === LEFT_DIRECTION && DontMoveElements.indexOf(CellY) == -1) {
                for(let j = CellX - 1; j > -1; j--) {
                    if(Field[CellY][j] === 0) {
                        Distance++;
                    } else {
                        if(Field[CellY][j] === Field[CellY][CellX]) {
                            Distance++;
                            DontMoveElements.push(CellY);
                        }

                        break;
                    }
                }
            }

            // Если направление движения вверх и в этой строке можно двигать клетки
            if(Direction === UP_DIRECTION && DontMoveElements.indexOf(CellX) == -1) {
                for(let j = CellY - 1; j > -1; j--) {
                    if(Field[j][CellX] === 0) {
                        Distance++;
                    } else {
                        if(Field[j][CellX] === Field[CellY][CellX]) {
                            Distance++;
                            DontMoveElements.push(CellX);
                        }

                        break;
                    }
                }
            }

            // Если направление движения вниз и в этой строке можно двигать клетки
            if(Direction === DOWN_DIRECTION && DontMoveElements.indexOf(CellX) == -1) {
                for(let j = CellY + 1; j < Field[CellY].length; j++) {
                    if(Field[j][CellX] === 0) {
                        Distance++;
                    } else {
                        if(Field[j][CellX] === Field[CellY][CellX]) {
                            Distance++;
                            DontMoveElements.push(CellX);
                        }

                        break;
                    }
                }
            }

            // Если дистанция движения больше нуля, запоминаем клетку
            if(Distance !== 0)
                MoveElements.push({Elem:i, X:CellX, Y:CellY, Dest:Distance, Move:0, State:false});
        }
    }

    return MoveElements;
}

/**
 * Функция анимирует массив клеток, сдвигая их в нужном направлении
 * @param Direction - направление движения
 * @param CellArray - массив клеток
 * @param MoveElements - массив клеток, которые необходимо сдвинуть
 * @param Time - скорость анимации
 */
function MoveCells(Direction, CellArray, MoveElements, Time) {
    var Interval = setInterval(function () {
        let Counter = 0;                // Счетчик клеток, которые завершили анимацию

        for(let i = 0; i < MoveElements.length; i++) {
            if(!MoveElements[i].State) {
                // Если движение вправо и конечная точка не достигнута, прибавляем координату
                if(Direction === RIGHT_DIRECTION) {
                    if((MoveElements[i].X * 100) + MoveElements[i].Move > (MoveElements[i].X * 100) + MoveElements[i].Dest * 100) {
                        MoveElements[i].State = true;
                        continue;
                    }

                    CellArray[MoveElements[i].Elem].style.left = (MoveElements[i].X * 100) + MoveElements[i].Move + "px";
                    MoveElements[i].Move += 10;
                }

                // Если движение влево и конечная точка не достигнута, отнимаем координату
                if(Direction === LEFT_DIRECTION) {
                    if((MoveElements[i].X * 100) - MoveElements[i].Move < (MoveElements[i].X * 100) - MoveElements[i].Dest * 100) {
                        MoveElements[i].State = true;
                        continue;
                    }

                    CellArray[MoveElements[i].Elem].style.left = (MoveElements[i].X * 100) - MoveElements[i].Move + "px";
                    MoveElements[i].Move += 10;
                }

                // Если движение вверх и конечная точка не достигнута, отнимаем координату
                if(Direction === UP_DIRECTION) {
                    if((MoveElements[i].Y * 100) - MoveElements[i].Move < (MoveElements[i].Y * 100) - MoveElements[i].Dest * 100) {
                        MoveElements[i].State = true;
                        continue;
                    }

                    CellArray[MoveElements[i].Elem].style.top = (MoveElements[i].Y * 100) - MoveElements[i].Move + "px";
                    MoveElements[i].Move += 10;
                }

                // Если движение вниз и конечная точка не достигнута, прибавляем координату
                if(Direction === DOWN_DIRECTION) {
                    if((MoveElements[i].Y * 100) + MoveElements[i].Move > (MoveElements[i].Y * 100) + MoveElements[i].Dest * 100) {
                        MoveElements[i].State = true;
                        continue;
                    }

                    CellArray[MoveElements[i].Elem].style.top = (MoveElements[i].Y * 100) + MoveElements[i].Move + "px";
                    MoveElements[i].Move += 10;
                }

            } else {
                // Если анмация клетки завершена, увеличиваем счетчик
                Counter++;
            }
        }

        // Если все клетки завершили анимацию, останавливаем анимацию
        if(Counter === MoveElements.length) {
            clearInterval(Interval);
        }

    }, Time);
}