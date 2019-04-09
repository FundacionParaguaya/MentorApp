# Regression test plan

With each deploy we should test the new features integrated in the newest app version. But along with that we should do regression testing - **make sure that new code changes do not have side effects on the existing functionalities**. With this in mind here is a short list of things to check and questions to ask along with any specifics for the release that is on the test track.

Items here should not take more than 15 mins to check. Anybody can follow these steps with no tech background, at any point during QA process. But if you find any bugs make sure to **properly describe them in issues** in this repository.

1. Log out of the app and in again. Check if everything syncs. Is the loading spinner showing indefinitely? Is syncing taking a longer time than usual?
2. As soon as you log in go to Sync. There should be nothing in syncing since logging should delete all that data.
3. Go to Families. Is the families list loading properly? Click on any random family and quickly check if:
   - Their lifemap is available for review
   - Their location page is showing the map (online only) and showing the family location
   - You can easily see individual family member's details
4. Make a new lifemap. Go through the whole process. Pay attention to:
   - Is there any moment where the Continue button is not available, where it should be?
   - Can you continue to the next screen on any page without all required data entered? It should not be possible.
   - Can you freely edit all fields in the form.
   - Are you redirected to the family members screen (names, genders, birthdates) when you select more than 1 family members.
   - Can you go back on previous screens and re-edit the information?
   - Can you exit the lifemap while in progress and then continue from where you left off?
   - Can you add priorities or achievements?
   - Can you answer skipped questions?
5. Go offline and again go quickly trough a survey. Can you complete it? Does it sync as soon as you go online?
