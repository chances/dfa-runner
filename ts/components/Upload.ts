module DFARunner {

    export class Upload extends FormComponent<string> {
        private _fileInput: Component;

        constructor () {
            super('#upload');

            this._fileInput = new Component(this.e.find('input[type=file]').get(0));
            this._fileInput.e.change(() => {
                var fileInput = <HTMLInputElement>this._fileInput.e.get(0),
                    files: FileList = fileInput.files,
                    reader = new FileReader();

                if (files.length > 0) {
                    // If there is a file, read it as text
                    reader.readAsText(files[0]);
                }

                reader.onload = () => {
                    var fileContents: string = reader.result;

                    this._events.trigger('upload', fileContents, this);
                };
            });

            // Add submit handler to upload file
            super.submit((event: Event) => {
                event.preventDefault();

                this._fileInput.e.val('');
                this._fileInput.e.click();
            });
        }

        upload(callback: BridgeCallback<string>): Upload {
            this.addEventListener('upload', (value: string) => {
                callback(value);
            });

            return this;
        }
    }
}
