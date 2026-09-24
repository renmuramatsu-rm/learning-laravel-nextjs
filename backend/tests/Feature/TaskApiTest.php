<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Task;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
class TaskApiTest extends TestCase
{
    /**
     * A basic feature test example.
     */

    use RefreshDatabase;

    protected function setUp(): void{
        parent::setUp();
        Sanctum::actingAs(
            User::factory()->create(),
            ['*']
        );
    }

    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_it_lists_tasks(): void
    {
        Task::factory()->count(3)->create();

        $this->getJson('/api/tasks')->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_it_creates_a_task(): void
    {
        $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => 'Test Description',
        ])->assertCreated()->assertJsonPath('data.title', 'Test Task')->assertJsonPath('data.description', 'Test Description')->assertJsonPath('data.completed', false);

        $this->assertDatabaseHas('tasks', ['title' => 'Test Task', 'description' => 'Test Description', 'completed' => false]);
    }

    public function test_it_requires_a_title_to_create_a_task():void{
        $this->postJson('/api/tasks', [])->assertUnprocessable()->assertJsonValidationErrors('title');
    }

    public function test_it_shows_a_task(): void{
        $task = Task::factory()->create();

        $this->getJson("/api/tasks/{$task->id}")->assertOk()->assertJsonPath('data.id', $task->id);
    }

    public function test_it_updates_a_task(): void
    {
        $task = Task::factory()->create(['completed' => false]);

        $this->putJson("/api/tasks/{$task->id}", [
            'completed'=>true
        ])->assertJsonPath('data.id',$task->id)->assertJsonPath('data.completed', true)->assertOK();

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'completed'=>true]);
    }

    public function test_it_deletes_a_task(): void
    {
        $task = Task::factory()->create();

        $this->deleteJson("/api/tasks/{$task->id}")->assertNoContent();
        $this->assertDatabaseMissing('tasks', ['id'=>$task->id]);
    }
}
