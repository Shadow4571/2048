'use strict';
const RIGHT_DIRECTION = 0;              // Вправо
const LEFT_DIRECTION = 1;               // Влево
const UP_DIRECTION = 2;                 // Вверх
const DOWN_DIRECTION = 3;               // Вниз

/**
 * Функция определяет движение курсора после нажатия клавиши и до ее отжатия
 * @return number - Возвращает одно из четырех направлений движения
 */
function GetDirection(MousePositionX, SavePositionX, MousePositionY, SavePositionY) {
    // Если разница в движение по горизонтали больше, чем по вертикали, то это движение влево-вправо, иначе вверх-вниз
    if(Math.abs(MousePositionX - SavePositionX) > Math.abs(MousePositionY - SavePositionY)) {
        // Если разница больше нуля, то движение вправо, иначе влево
        if(MousePositionX - SavePositionX > 0) {
            return RIGHT_DIRECTION;
        } else {
            return LEFT_DIRECTION;
        }
    } else {
        // Если разница больше нуля, то движение вниз, иначе вверх
        if(MousePositionY - SavePositionY > 0) {
            return DOWN_DIRECTION;
        } else {
            return UP_DIRECTION;
        }
    }
}