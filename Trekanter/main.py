import pygame, random, sys, os
from pygame.locals import *

pygame.init()
screen = pygame.display.Info()
screen_size = [screen.current_w, screen.current_h]

display = pygame.display.set_mode((screen_size[0], screen_size[1]))

FPS = 10
clock = pygame.time.Clock()

# ---------- TEMPORARY -----------
def change_mode():
    pygame.display.toggle_fullscreen()

button = pygame.Surface((30, 30))
button_rect = pygame.Rect(screen_size[0] - 130, 100, 30, 30)
button.fill((255, 255, 255))

def mouse_collide():
    position = pygame.mouse.get_pos()
    collides = button_rect.collidepoint(position[0], position[1])
    pressed = pygame.mouse.get_pressed()
    if pressed[0]:
        if collides:
            change_mode()
# ----------------------------------

# Display
A4_WIDTH = 840
A4_HEIGHT = 1188
img_canvas = pygame.Surface((A4_WIDTH, A4_HEIGHT))

# --- Trekant ---

class Triangle():
    def __init__(self):
        # Is a local surface required?
        self.surf = pygame.Surface((840, 1188), pygame.SRCALPHA)
        self.rect = pygame.Rect(20, 200, 800, 400)
        self.corner_a = (10, 400)
        self.corner_b = (790, 400)
        self.corner_c = (380, 10)
        self.center = (210, 200)
        self.width = 6

    def draw(self):
        self.corners = [self.corner_a, self.corner_b, self.corner_c]
        #self.surf.fill((0, 0, 0, 0))

        #for i in range(len(self.corners)):
            #if i < 2:
               # pygame.draw.line(self.surf, (25, 25, 25), self.corners[i], self.corners[i+1], width=14)
            #else:
                #pygame.draw.line(self.surf, (25, 25, 25), self.corners[i], self.corner_a, width=14)
            #pygame.draw.circle(self.surf, (25, 25, 25), self.corners[i], 7)

        pygame.draw.line(self.surf, (25, 25, 25), self.corner_a, self.corner_c, width=7)
        img_canvas.blit(self.surf, self.rect)

triangle1 = Triangle()

while True:
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
            sys.exit()
    display.fill((51, 54, 72))
    img_canvas.fill((255, 255, 255))
    triangle1.draw()
    display.blit(img_canvas, (700, 100))
    mouse_collide()
    display.blit(button, button_rect)
    pygame.display.update()
    clock.tick(FPS)
